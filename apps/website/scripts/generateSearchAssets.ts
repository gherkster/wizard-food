import * as crypto from "node:crypto";
import * as fs from "node:fs/promises";
import path from "node:path";

import { loadAllRecipes, type RecipePreview } from "@wizard/content";
import MiniSearch from "minisearch";

import type { AppVersion } from "../types/version";
import {
  searchIndexSettings,
  type SearchIndexRecipe,
  type SearchIndexSearchFields,
} from "../utils/search";

// https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
const commitHashVariableName = "WORKERS_CI_COMMIT_SHA";

if (process.env.CI && !process.env[commitHashVariableName]) {
  throw new Error(
    `${commitHashVariableName} environment variable is undefined. A build ID cannot be determined.`,
  );
}
const publicDir = path.resolve(process.cwd(), "public");

/**
 * Generates the minisearch search index and persists it to output.
 * @param recipes The recipes containing the fields to be indexed and stored in the search index.
 * @returns The md5 hash of the generated search index.
 */
const generateSearchIndexAsset = async (recipes: SearchIndexRecipe[]) => {
  console.log("Generating recipe search index");
  const miniSearch = new MiniSearch<SearchIndexSearchFields>(searchIndexSettings);

  miniSearch.addAll(recipes);

  const indexJson = JSON.stringify(miniSearch);

  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(`${publicDir}/search-index.json`, indexJson, "utf8");

  const hash = crypto.createHash("md5").update(indexJson).digest("hex");
  console.log("Generated search index hash:", hash);

  return { hash };
};

/**
 * Generates the application version asset and persists it to output.
 * @param version The current version of the application.
 */
const generateAppVersionAsset = async (version: AppVersion) => {
  const versionJson = JSON.stringify(version);

  await fs.writeFile(`${publicDir}/version.json`, versionJson, "utf8");

  console.log("Generated version.json", versionJson);
};

// We don't want to index every field in the recipe since it's client side and would make it excessively big,
// so just index the fields we want to keep client side to show in the search results.
const mapToSearchIndexRecipe = (recipe: RecipePreview): SearchIndexRecipe => {
  return {
    title: recipe.title,
    image: {
      height: recipe.previewImage.height,
      width: recipe.previewImage.width,
      sizes: recipe.previewImage.sizes,
      src: recipe.previewImage.src,
      srcSet: recipe.previewImage.srcSet,
    },
    totalDuration: recipe.durationTotal?.text,
    tags: recipe.tags,
    featuredTag: recipe.featuredTag,
    slug: recipe.slug,
  };
};

const contentDir = path.resolve(process.cwd(), ".content");
const recipes = await loadAllRecipes(contentDir);

const searchIndexEntries = recipes.map((r) => mapToSearchIndexRecipe(r));

const { hash } = await generateSearchIndexAsset(searchIndexEntries);

await generateAppVersionAsset({
  buildId: process.env[commitHashVariableName] ?? "local",
  searchIndexHash: hash,
});
