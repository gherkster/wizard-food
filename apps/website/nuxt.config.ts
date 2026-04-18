export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  ssr: true,

  routeRules:
    process.env.NODE_ENV === "development"
      ? {}
      : {
          /*
          Force all routes to prerender.
          This fixes an issue with calls to /api/recipes/<id> working for a hard reload,
          but still being made on client side navigation.

          In dev mode this currently causes payload cache key collisions ("/" vs nested routes)
          and leads to ENOTDIR errors under .nuxt/cache/nuxt/payload.
        */
          "/**": { prerender: true },
        },

  nitro: {
    prerender: {
      // Disable to prevent unnecessary trailing slash redirects
      // https://community.cloudflare.com/t/removing-trailing-slash-on-static-websites/583429/3
      autoSubfolderIndex: false,
      // We are already dynamically adding most recipe links in the recipe module prerender hook, so / and /recipes are added there as well to avoid spending time crawling the site.
      crawlLinks: false,
    },
    cloudflare: {
      // Fix a redirected config being deployed that assumes a worker mjs file is being used https://github.com/nuxt/nuxt/issues/34186
      deployConfig: false,
    },
  },

  appConfig: {
    externalBaseUrl: "", // Overridden by recipe module
  },

  runtimeConfig: {
    public: {
      /*
        Overridden in recipe module. This is included in the generated HTML,
        meaning it does not cause cascading cache busting issues
      */
      searchIndexHash: "",
    },
  },

  site: {
    url: process.env.PUBLIC_SITE_URL,
  },

  typescript: {
    // Enable build-time type checking, only currently enabled in local development due to pipeline issues
    typeCheck: process.env.NODE_ENV === "development",
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
        scss: {},
      },
    },
  },

  /**
   * The recipe module is explicitly included in this list since it handles
   * prerender route generation, static content injection, and search index output.
   */
  modules: ["@nuxt/fonts", "@nuxtjs/sitemap", "@nuxtjs/robots", "./modules/recipe", "@nuxt/icon"],

  imports: {
    scan: false, // Only auto import framework-specific functions like ref
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
        dir: "./assets/icons",
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
