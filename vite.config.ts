import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
      "@features": fileURLToPath(new URL("./src/features", import.meta.url)),
      "@routes": fileURLToPath(new URL("./src/routes", import.meta.url)),
      "@services": fileURLToPath(new URL("./src/services", import.meta.url)),
      "@stores": fileURLToPath(new URL("./src/stores", import.meta.url)),
      "@config": fileURLToPath(new URL("./src/config", import.meta.url)),
      "@constants": fileURLToPath(new URL("./src/constants", import.meta.url)),
      "@theme": fileURLToPath(new URL("./src/theme", import.meta.url)),
      "@utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.E2E_API_BASE_URL || "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy) => {
          // The browser talks to this Vite origin. Forward the API call server-to-server
          // without carrying the browser's Origin header to the backend.
          proxy.on("proxyReq", (proxyRequest) => proxyRequest.removeHeader("origin"));
        },
      },
      "/uploads": {
        target: process.env.E2E_API_BASE_URL || "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
