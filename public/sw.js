const CACHE_NAME = "wheel-v4";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html",
  "/wheel.svg",
  /* __APP_SHELL_ASSETS__ */
];

async function cacheResponse(request, response) {
  if (!response || response.status !== 200 || response.type === "opaque") {
    return response;
  }

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_NAME);

  await Promise.all(
    urls.map(async (url) => {
      try {
        const resolvedUrl = new URL(url, self.location.origin);
        if (resolvedUrl.origin !== self.location.origin) return;
        await cache.add(`${resolvedUrl.pathname}${resolvedUrl.search}`);
      } catch {
        // Ignore bad URLs from the page.
      }
    }),
  );
}

// Install: precache the app shell, skip waiting to activate immediately
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: purge ALL old caches and take control immediately
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("message", (e) => {
  if (e.data?.type !== "CACHE_URLS" || !Array.isArray(e.data.payload)) {
    return;
  }

  e.waitUntil(cacheUrls(e.data.payload));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();

  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          return client.focus();
        }
      }

      return self.clients.openWindow("/");
    }),
  );
});

// Fetch handler: fully offline-capable
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET requests
  if (e.request.method !== "GET") return;

  // Skip chrome-extension and other non-http
  if (!url.protocol.startsWith("http")) return;

  // For navigation requests (HTML): network-first with cache fallback
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => cacheResponse(e.request, res))
        .catch(() =>
          caches.match(e.request).then(
            (r) => r || caches.match("/") || caches.match("/offline.html"),
          ),
        )
    );
    return;
  }

  // For hashed assets (JS/CSS bundles from Vite): cache-first (immutable)
  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request).then((res) => cacheResponse(e.request, res))
      )
    );
    return;
  }

  // Everything else: stale-while-revalidate
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetching = fetch(e.request)
        .then((res) => cacheResponse(e.request, res))
        .catch(() => cached);

      return cached || fetching;
    })
  );
});
