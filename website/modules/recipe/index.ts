import MiniSearch from "minisearch";
import { defineNuxtModule, useLogger } from "nuxt/kit";
import * as fs from "fs/promises";
import * as crypto from "crypto";
import type { Nuxt } from "nuxt/schema";
import { formatDuration, recipeTotalDuration } from "~~/shared/utils/formatting";
import { searchIndexSettings } from "~~/shared/utils/searchIndex";

const logger = useLogger();

export default defineNuxtModule({
  async setup(options, nuxt) {
    if (!process.env.CF_PAGES_COMMIT_SHA) {
      throw new Error(
        "CF_PAGES_COMMIT_SHA environment variable is undefined. A build ID cannot be determined.",
      );
    }

    // Populate external URL injected automatically in Cloudflare pipeline
    nuxt.options.appConfig.externalBaseUrl = process.env.NUXT_PUBLIC_SITE_URL ?? "";

    nuxt.hook("prerender:routes", async ({ routes }) => {
      // Import dynamically, as this won't exist at the start of a clean build so it cannot be top level imported, and would otherwise result in a build error
      const recipes = (await import("~~/.nuxt/module/nuxt-prepare")).recipes;

      const recipeRoutes = recipes.map((recipe) => `/recipes/${recipe.slug}`);
      recipeRoutes.forEach((s) => routes.add(s));

      logger.info(`Added ${recipeRoutes.length} routes to prerender`);
      logger.info(recipeRoutes);
    });

    nuxt.hooks.hook("nitro:build:public-assets", async () => {
      // Import dynamically, as this won't exist at the start of a clean build so it cannot be top level imported, and would otherwise result in a build error
      const recipes = (await import("~~/.nuxt/module/nuxt-prepare")).recipes;

      const searchIndex = generateRecipeSearchIndex(recipes.map((r) => mapToSearchIndexRecipe(r)));
      await saveRecipeSearchIndex(searchIndex, nuxt);
    });
  },
});

function generateRecipeSearchIndex(recipes: SearchIndexRecipe[]) {
  logger.info("Generating recipe search index");
  const miniSearch = new MiniSearch<SearchIndexSearchFields>(searchIndexSettings);

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
  logger.info("Generated search index hash:", hash);

  const currentVersion: Version = {
    build: process.env.CF_PAGES_COMMIT_SHA!,
    searchIndex: hash,
  };

  /*
    Store the current versions of assets in /public to allow the client to periodically check for newer content.
    The documentation for why this is required is in the versioning global middleware.
  */
  await fs.writeFile(`${publicFolderPath}/version.json`, JSON.stringify(currentVersion), "utf8");
}

const mapToSearchIndexRecipe = (serverRecipe: RecipePayload): SearchIndexRecipe => {
  return {
    title: serverRecipe.title,
    coverImage: serverRecipe.coverImage,
    totalDurationLabel: formatDuration(recipeTotalDuration(serverRecipe)),
    tags: serverRecipe.tags,
    featuredTag: serverRecipe.featuredTag,
    slug: serverRecipe.slug,
  };
};
