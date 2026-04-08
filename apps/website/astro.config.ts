import { fileURLToPath } from "node:url";

import { defineConfig, fontProviders } from "astro/config";
import vue from "@astrojs/vue";

import { recipeSearchIndexIntegration } from "./src/integrations/recipe-search-index";

const workspaceRoot = fileURLToPath(new URL("../../", import.meta.url));
const srcDir = fileURLToPath(new URL("./src", import.meta.url));

const websiteUrl = process.env.WEBSITE_URL;
if (!websiteUrl) {
  throw new Error("WEBSITE_URL environment variable not defined.");
}

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), recipeSearchIndexIntegration()],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [400, 600],
    },
  ],
  site: websiteUrl,
  trailingSlash: "never", // Don't use trailing slashes with cloudflare
  vite: {
    resolve: {
      alias: {
        "@": srcDir,
      },
    },
    server: {
      fs: {
        allow: [workspaceRoot],
      },
    },
  },
});
