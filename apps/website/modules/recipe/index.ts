import * as crypto from "node:crypto";
import * as fs from "node:fs/promises";

import type { RecipePreview } from "@wizard/content";
import { loadAllRecipes } from "@wizard/content";
import MiniSearch from "minisearch";
import { defineNuxtModule, useLogger } from "nuxt/kit";
import type { Nuxt } from "nuxt/schema";

import {
  type SearchIndexRecipe,
  type SearchIndexSearchFields,
  searchIndexSettings,
} from "../../utils/search";

const logger = useLogger();

// https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
const commitHashVariableName = "WORKERS_CI_COMMIT_SHA";

export default defineNuxtModule({
  async setup(_, nuxt) {
    const buildId = process.env[commitHashVariableName] ?? "local";
    const contentDir = `${nuxt.options.rootDir}/.content`;

    if (process.env.CI && !process.env[commitHashVariableName]) {
      throw new Error(
        `${commitHashVariableName} environment variable is undefined. A build ID cannot be determined.`,
      );
    }

    nuxt.options.appConfig.externalBaseUrl = process.env.NUXT_PUBLIC_SITE_URL ?? "";

    const recipes = await loadAllRecipes(contentDir);

    nuxt.hook("prerender:routes", async ({ routes }) => {
      const recipeRoutes = recipes.map((recipe) => `/recipes/${recipe.slug}`);
      recipeRoutes.forEach((s) => routes.add(s));

      logger.info(`Added ${recipeRoutes.length} routes to prerender`);

      const searchIndex = generateRecipeSearchIndex(recipes.map((r) => mapToSearchIndexRecipe(r)));
      await saveRecipeSearchIndex(searchIndex, nuxt, buildId);
    });

    if (process.env.NODE_ENV === "development") {
      logger.info("Refreshing search index for local development");

      const searchIndex = generateRecipeSearchIndex(recipes.map((r) => mapToSearchIndexRecipe(r)));
      await saveRecipeSearchIndex(searchIndex, nuxt, buildId);
    }
  },
});

const generateRecipeSearchIndex = (recipes: SearchIndexRecipe[]) => {
  logger.info("Generating recipe search index");
  const miniSearch = new MiniSearch<SearchIndexSearchFields>(searchIndexSettings);

  miniSearch.addAll(recipes);
  return JSON.stringify(miniSearch);
};

async function saveRecipeSearchIndex(index: string, nuxt: Nuxt, buildId: string) {
  const publicFolderPath = `${nuxt.options.rootDir}/public`;
  await fs.mkdir(publicFolderPath, { recursive: true });
  await fs.writeFile(`${publicFolderPath}/search-index.json`, index, "utf8");

  const hash = crypto.createHash("md5").update(index).digest("hex");
  logger.info("Generated search index hash:", hash);

  const currentVersion = {
    build: buildId,
    searchIndex: hash,
  };

  const versionJson = JSON.stringify(currentVersion);
  await fs.writeFile(`${publicFolderPath}/version.json`, versionJson, "utf8");
  logger.info("Generated version.json", versionJson);
}

const mapToSearchIndexRecipe = (recipe: RecipePreview): SearchIndexRecipe => {
  return {
    title: recipe.title,
    coverImage: {
      height: recipe.coverImage.height,
      width: recipe.coverImage.width,
      previewSquare: recipe.coverImage.variants.preview.square,
    },
    totalDurationLabel: recipe.totalDurationLabel,
    tags: recipe.tags,
    featuredTag: recipe.featuredTag,
    slug: recipe.slug,
  };
};
