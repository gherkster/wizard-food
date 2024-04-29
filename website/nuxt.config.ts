import visualizer from "rollup-plugin-visualizer";
import { fileURLToPath } from "url";

export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    /*
      Force all routes to prerender.
      This fixes an issue with calls to /api/recipes/<id> working for a hard reload,
      but still being made on client side navigation
    */
    "/**": { prerender: true },
  },
  nitro: {
    prerender: {
      // Disable to prevent unnecessary trailing slash redirects
      // https://community.cloudflare.com/t/removing-trailing-slash-on-static-websites/583429/3
      autoSubfolderIndex: false,
    },
  },
  appConfig: {
    nuxtIcon: {
      size: "24px",
    },
    searchIndex: {
      hash: "",
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
