import { createResolver } from "@nuxt/kit";
const resolver = createResolver(import.meta.url);

export default defineNuxtConfig({
  alias: {
    "styled-system": resolver.resolve("./styled-system"),
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

  appConfig: {
    externalBaseUrl: "", // Overridden by recipe module
  },

  compatibilityDate: "2025-02-27",

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  css: ["@/assets/css/global.css"],

  fonts: {
    defaults: {
      weights: [400],
    },
  },

  future: {
    compatibilityVersion: 4,
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

  imports: {
    scan: false, // Only auto import framework-specific functions like ref
  },

  /**
   * The recipe module is explicitly included in this list since it handles
   * prerender route generation, static content injection, and search index output.
   */
  modules: ["@nuxt/fonts", "@nuxtjs/sitemap", "@nuxtjs/robots", "./modules/recipe", "@nuxt/icon"],

  nitro: {
    prerender: {
      // Disable to prevent unnecessary trailing slash redirects
      // https://community.cloudflare.com/t/removing-trailing-slash-on-static-websites/583429/3
      autoSubfolderIndex: false,
      crawlLinks: false,
      // The recipe links are being dynamically added in the recipe module prerender hook.
      routes: ["/", "/recipes"],
    },
    cloudflare: {
      // Fix a redirected config being deployed that assumes a worker mjs file is being used https://github.com/nuxt/nuxt/issues/34186
      deployConfig: false,
    },
  },

  postcss: {
    plugins: {
      "@pandacss/dev/postcss": {},
    },
  },

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

  ssr: true,

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
  },
});
