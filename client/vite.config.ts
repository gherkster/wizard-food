import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import vue from "@vitejs/plugin-vue";
import visualizer from "rollup-plugin-visualizer";

import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    viteCompression({
      algorithm: "brotliCompress",
      deleteOriginFile: false,
    }),
    viteCompression({
      algorithm: "gzip",
      deleteOriginFile: false,
    }),
    visualizer({
      filename: "chunk-sizes.html",
      template: "treemap",
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      lodash: "lodash-es",
    },
  },
  build: {
    outDir: "../server/API/wwwroot",
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    hmr: {
      protocol: "ws",
      port: 52123,
    },
  },
});
