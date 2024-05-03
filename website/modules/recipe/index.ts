import MiniSearch from "minisearch";
import { defineNuxtModule } from "nuxt/kit";
import { useDirectus, useMapper } from "../../composables";
import type { RecipePreview } from "../../types/recipe";
import { searchIndexSettings, type SearchIndexIndexed } from "../../types/searchIndex";
import * as fs from "fs/promises";
import * as crypto from "crypto";
import type { Nuxt } from "nuxt/schema";

export default defineNuxtModule({
  async setup(options, nuxt) {
    const recipes = await getAllRecipes();

    const searchIndex = generateRecipeSearchIndex(recipes);

    await saveRecipeSearchIndex(searchIndex, nuxt);

    nuxt.hook("prerender:routes", async ({ routes }) => {
      // TODO: This should be more efficient to avoid retrieving all recipes upfront,
      // then again retrieving all recipes one by one when statically generating in useAsyncData
      const slugs = recipes.map((r) => `/recipes/${r.slug}`);
      slugs.forEach((s) => routes.add(s));
    });
  },
});

async function getAllRecipes(): Promise<RecipePreview[]> {
  console.log(`Loading recipes from ${process.env.NUXT_BASE_URL}`);
  const client = useDirectus({
    url: process.env.NUXT_BASE_URL!,
    clientId: process.env.NUXT_CF_ACCESS_CLIENT_ID!,
    clientSecret: process.env.NUXT_CF_ACCESS_CLIENT_SECRET!,
  });

  const remoteRecipes = await client.getAllRecipes();

  remoteRecipes.forEach((r) => {
    console.log(r.slug);
    if (!r.slug) {
      throw new Error(`Recipe not in the expected format: ${r}`);
    }
  });

  if (remoteRecipes.length === 0) {
    throw new Error(`No recipes were retrieved from ${process.env.NUXT_BASE_URL}`);
  }

  const mapper = useMapper();
  return remoteRecipes.map(mapper.toRecipePreview);
}

function generateRecipeSearchIndex(recipes: RecipePreview[]) {
  console.log("Generating recipe search index");
  const miniSearch = new MiniSearch<SearchIndexIndexed>(searchIndexSettings);

  miniSearch.addAll(recipes);
  return JSON.stringify(miniSearch);
}

async function saveRecipeSearchIndex(index: string, nuxt: Nuxt) {
  // Store recipe search index in public folder for client retrieval
  const imageFolder = `${nuxt.options.rootDir}/public`;
  await fs.mkdir(imageFolder, { recursive: true });
  await fs.writeFile(`${imageFolder}/search-index.json`, index, "utf8");

  // Store a hash of the index in config for cache busting
  const hash = crypto.createHash("md5").update(index).digest("hex");
  nuxt.options.appConfig.searchIndex.hash = hash;
}
