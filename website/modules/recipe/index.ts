import MiniSearch from "minisearch";
import { defineNuxtModule } from "nuxt/kit";
import { useDirectus, useMapper } from "../../composables";
import type { RecipePreview } from "../../types/recipe";
import { searchIndexSettings, type SearchIndexIndexed } from "../../types/searchIndex";
import * as fs from "fs/promises";
import * as crypto from "crypto";
import type { Nuxt } from "nuxt/schema";
import type { Version } from "~/types/version";

export default defineNuxtModule({
  async setup(options, nuxt) {
    if (!process.env.CF_PAGES_COMMIT_SHA) {
      throw new Error("CF_PAGES_COMMIT_SHA environment variable is undefined. A build ID cannot be determined.");
    }

    const recipes = await getAllRecipes();

    const searchIndex = generateRecipeSearchIndex(recipes);

    // Populate external URL injected automatically in Cloudflare pipeline
    nuxt.options.appConfig.externalBaseUrl = process.env.NUXT_PUBLIC_SITE_URL ?? "";

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
  const publicFolderPath = `${nuxt.options.rootDir}/public`;
  await fs.mkdir(publicFolderPath, { recursive: true });
  await fs.writeFile(`${publicFolderPath}/search-index.json`, index, "utf8");

  // Store a hash of the index in config for cache busting
  const hash = crypto.createHash("md5").update(index).digest("hex");
  console.log("Generated search index hash:", hash);

  const currentVersion: Version = {
    build: process.env.CF_PAGES_COMMIT_SHA!,
    searchIndex: hash,
  };

  /*
    Store the current versions of assets in /public to allow the client
    to periodically check for newer content
  */
  await fs.writeFile(`${publicFolderPath}/version.json`, JSON.stringify(currentVersion), "utf8");
}
