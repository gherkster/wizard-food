import { fileURLToPath } from "url";

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
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
    externalBaseUrl: "", // Overridden by recipe module
  },

  runtimeConfig: {
    baseUrl: "", // Overridden by .env NUXT_BASE_URL
    cfAccessClientId: "", // Overridden by .env NUXT_CF_ACCESS_CLIENT_ID
    cfAccessClientSecret: "", // Overridden by .env NUXT_CF_ACCESS_CLIENT_SECRET
    public: {
      /*
        Overridden in recipe module. This is included in the generated HTML,
        meaning it does not cause cascading cache busting issues
      */
      searchIndexHash: "",
    },
  },

  typescript: {
    // Enable build-time type checking, only currently enabled in local development due to pipeline issues
    typeCheck: import.meta.dev,
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "_nuxt/entry.[hash].js",
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler", // or "modern"
        },
      },
    },
  },

  /**
   * The recipe module is explicity included in this list instead of auto importing
   * since it relies on the output of nuxt-prepare
   */
  modules: [
    "nuxt-prepare",
    "@nuxt/fonts",
    "@nuxtjs/sitemap",
    "@nuxt/eslint",
    "@nuxtjs/robots",
    "./modules/recipe",
    "@nuxt/icon",
  ],

  alias: {
    common: fileURLToPath(new URL("../common", import.meta.url)),
  },

  imports: {
    dirs: ["clients"],
  },

  fonts: {
    defaults: {
      weights: [400],
    },
  },

  icon: {
    class: "icon",
    provider: "none",
    clientBundle: {
      // scan all components in the project and include icons
      scan: true,

      // include all custom collections in the client bundle
      includeCustomCollections: true,

      // guard for uncompressed bundle size, will fail the build if exceeds
      sizeLimitKb: 256,
    },
    customCollections: [
      {
        prefix: "wf",
        dir: "./app/assets/icons",
      },
    ],
  },

  app: {
    head: {
      meta: [
        {
          name: "color-scheme",
          content: "light dark",
        },
      ],
      htmlAttrs: {
        lang: "en",
      },
    },
  },

  compatibilityDate: "2025-02-27",
});
