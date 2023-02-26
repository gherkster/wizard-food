import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const path = require("path");

export default defineConfig({
  plugins: [vue()],
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
