import { useDirectus } from "./composables/useDirectus";
import * as fs from "fs/promises";
import MiniSearch from "minisearch";
import { SearchIndexIndexed, searchIndexSettings } from "./types/searchIndex";

import { ServerRecipe } from "~/types/serverRecipe";
import visualizer from "rollup-plugin-visualizer";

const baseUrl = import.meta.env.NUXT_PUBLIC_BASE_URL;
const recipes: ServerRecipe[] = [];

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  runtimeConfig: {
    public: {
      baseUrl: "",
    },
  },
  vite: {
    plugins: [
      visualizer({
        gzipSize: true,
      }),
    ],
  },
  ignore: ["functions/**/*.*"],
  hooks: {
    async "build:before"() {
      await loadAllRecipes();

      await generateRecipeSearchIndex();
    },
    async "prerender:routes"({ routes }) {
      const slugs = recipes.map((r) => `/recipes/${r.slug}`);
      slugs.forEach((s) => routes.add(s));
    },
  },
});

async function loadAllRecipes() {
  const client = useDirectus(baseUrl); // Cannot use useRuntimeConfig in here since it is undefined

  const remoteRecipes = await client.getAllRecipes();
  if (remoteRecipes.length === 0) {
    throw new Error(`No recipes were retrieved from ${baseUrl}`);
  }

  recipes.push(...remoteRecipes);
}

async function generateRecipeSearchIndex() {
  const miniSearch = new MiniSearch<SearchIndexIndexed>(searchIndexSettings);
  miniSearch.addAll(recipes);
  const indexJson = JSON.stringify(miniSearch);

  await fs.writeFile(`${__dirname}/assets/search-index.json`, indexJson, "utf8");
}
