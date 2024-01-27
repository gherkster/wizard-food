import { useDirectus } from "./composables/useDirectus";
import * as fs from "fs/promises";
import MiniSearch from "minisearch";
import { SearchIndexIndexed, searchIndexSettings } from "./types/searchIndex";

import { ServerRecipe } from "~/types/serverRecipe";
import visualizer from "rollup-plugin-visualizer";

const baseUrl = process.env.NUXT_BASE_URL;
const recipes: ServerRecipe[] = [];

export default defineNuxtConfig({
  ssr: true,
  vite: {
    plugins: [
      visualizer({
        gzipSize: true,
      }),
    ],
  },
  hooks: {
    async "prerender:routes"({ routes }) {
      await loadAllRecipes();

      await generateRecipeSearchIndex();

      const slugs = recipes.map((r) => `/recipes/${r.slug}`);
      slugs.forEach((s) => routes.add(s));
    },
  },
});

async function loadAllRecipes() {
  console.log(`Loading recipes from ${baseUrl}`);
  const client = useDirectus();


  const remoteRecipes = await client.getAllRecipes();

  remoteRecipes.forEach((r) => {
    console.log(r.slug);
    if (!r.slug) {
      throw new Error(`Recipe not in the expected format: ${r}`);
    }
  });

  if (remoteRecipes.length === 0) {
    throw new Error(`No recipes were retrieved from ${baseUrl}`);
  }

  recipes.push(...remoteRecipes);
}

async function generateRecipeSearchIndex() {
  console.log("Generating recipe search index");
  const miniSearch = new MiniSearch<SearchIndexIndexed>(searchIndexSettings);

  miniSearch.addAll(recipes);
  const indexJson = JSON.stringify(miniSearch);

  const imageFolder = `${__dirname}/assets`;
  await fs.mkdir(imageFolder, { recursive: true });
  await fs.writeFile(`${imageFolder}/search-index.json`, indexJson, "utf8");
}
