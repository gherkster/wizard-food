import { fileURLToPath } from "node:url";

import { defineConfig, fontProviders } from "astro/config";
import vue from "@astrojs/vue";

import { recipeSearchIndexIntegration } from "./src/integrations/recipe-search-index";

const workspaceRoot = fileURLToPath(new URL("../../", import.meta.url));
const srcDir = fileURLToPath(new URL("./src", import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [vue(), recipeSearchIndexIntegration()],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
    },
  ],
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
