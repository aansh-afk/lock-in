import React from "react";
import ReactDOM from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider } from "./lib/auth";
import App from "./App";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

// Register service worker for PWA install prompt
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ConvexProvider>
  </React.StrictMode>
);
