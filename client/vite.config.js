import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";
import vue from "@vitejs/plugin-vue";

const path = require("path");

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
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "../server/API/wwwroot",
  },
  server: {
    host: true,
    hmr: {
      protocol: "ws",
      port: 52123,
    },
  },
});
