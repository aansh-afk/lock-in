import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const ROOT_DIR = fileURLToPath(new URL(".", import.meta.url));

function injectAppShellAssets() {
  return {
    name: "inject-app-shell-assets",
    apply: "build" as const,
    closeBundle() {
      const distDir = resolve(ROOT_DIR, "dist");
      const indexHtmlPath = resolve(distDir, "index.html");
      const swPath = resolve(distDir, "sw.js");
      const indexHtml = readFileSync(indexHtmlPath, "utf8");
      const swSource = readFileSync(swPath, "utf8");
      const assetUrls = Array.from(indexHtml.matchAll(/(?:src|href)="([^"]+)"/g), (match) => match[1]).filter(
        (url) => url.startsWith("/assets/"),
      );
      const uniqueAssetUrls = Array.from(new Set(assetUrls));
      const replacement = uniqueAssetUrls.length
        ? `\n  ${uniqueAssetUrls.map((url) => JSON.stringify(url)).join(",\n  ")},\n  `
        : "\n  ";

      writeFileSync(swPath, swSource.replace("/* __APP_SHELL_ASSETS__ */", replacement));
    },
  };
}

export default defineConfig({
  plugins: [react(), injectAppShellAssets()],
  server: {
    port: 5173,
  },
});
