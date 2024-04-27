import visualizer from "rollup-plugin-visualizer";
import { fileURLToPath } from "url";

export default defineNuxtConfig({
  ssr: true,
  appConfig: {
    nuxtIcon: {
      size: "24px",
    },
  },
  vite: {
    plugins: [
      visualizer({
        gzipSize: true,
      }),
    ],
  },
  modules: ["nuxt-icon"],
  // https://nuxt.com/docs/guide/going-further/runtime-config
  runtimeConfig: {
    baseUrl: "", // Overridden by .env NUXT_BASE_URL
    cfAccessClientId: "", // Overridden by .env NUXT_CF_ACCESS_CLIENT_ID
    cfAccessClientSecret: "", // Overridden by .env NUXT_CF_ACCESS_CLIENT_SECRET
  },
  alias: {
    common: fileURLToPath(new URL("../common", import.meta.url)),
  },
});
