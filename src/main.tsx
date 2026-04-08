import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

function collectAppShellUrls(): Array<string> {
  const urls = new Set<string>(["/", "/index.html", "/manifest.json", "/offline.html"]);

  for (const element of document.querySelectorAll("link[href], script[src]")) {
    const value =
      element instanceof HTMLLinkElement ? element.href : element instanceof HTMLScriptElement ? element.src : "";

    if (!value) continue;

    const url = new URL(value, window.location.origin);
    if (url.origin === window.location.origin) {
      urls.add(`${url.pathname}${url.search}`);
    }
  }

  return Array.from(urls);
}

function postCacheUrls(registration: ServiceWorkerRegistration) {
  const message = {
    type: "CACHE_URLS",
    payload: collectAppShellUrls(),
  };

  registration.installing?.postMessage(message);
  registration.waiting?.postMessage(message);
  registration.active?.postMessage(message);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        postCacheUrls(registration);

        registration.addEventListener("updatefound", () => {
          postCacheUrls(registration);
        });

        navigator.serviceWorker.ready
          .then((readyRegistration) => {
            postCacheUrls(readyRegistration);
          })
          .catch(() => {});
      })
      .catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
