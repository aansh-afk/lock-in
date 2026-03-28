const CACHE_NAME = "wheel-v3";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/wheel.svg",
];

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
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request).then((r) => r || caches.match("/")))
    );
    return;
  }

  // For hashed assets (JS/CSS bundles from Vite): cache-first (immutable)
  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request).then((res) => {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
            return res;
          })
      )
    );
    return;
  }

  // Everything else: stale-while-revalidate
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetching = fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          return res;
        })
        .catch(() => cached);

      return cached || fetching;
    })
  );
});
