import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";

import MiniSearch from "minisearch";
import { getAllRecipes } from "@wizard/content";

const searchIndexSettings = {
  fields: ["title", "tags"],
  idField: "slug",
  storeFields: [
    "slug",
    "title",
    "tags",
    "featuredTag",
    "totalDurationLabel",
    "cuisine",
    "diets",
    "mainIngredients",
    "cookingStyle",
    "coverImage",
  ],
};

const contentDir = process.env.CONTENT_DIR ?? path.resolve(process.cwd(), ".content");
const publicDir = path.resolve(process.cwd(), "public");
const buildId = process.env.CF_PAGES_COMMIT_SHA ?? "local";

const recipes = await getAllRecipes(contentDir);

const indexRecipes = recipes.map((recipe) => {
  return {
    title: recipe.title,
    coverImage: {
      height: recipe.coverImage.height,
      width: recipe.coverImage.width,
      previewSquare: recipe.coverImage.variants.preview.square,
    },
    slug: recipe.slug,
    tags: recipe.tags,
    featuredTag: recipe.featuredTag,
    totalDurationLabel: recipe.totalDurationLabel,
    cuisine: recipe.cuisine,
    diets: recipe.diets ?? [],
    mainIngredients: recipe.main_ingredients ?? [],
    cookingStyle: recipe.method,
  };
});

const miniSearch = new MiniSearch(searchIndexSettings);
miniSearch.addAll(indexRecipes);

const serializedIndex = JSON.stringify(miniSearch);
const searchIndexHash = crypto.createHash("md5").update(serializedIndex).digest("hex");

await fs.mkdir(publicDir, { recursive: true });
await fs.writeFile(path.join(publicDir, "search-index.json"), serializedIndex, "utf8");
await fs.writeFile(
  path.join(publicDir, "version.json"),
  JSON.stringify(
    {
      build: buildId,
      searchIndex: searchIndexHash,
    },
    null,
    2,
  ),
  "utf8",
);

console.info(
  `Generated search-index.json and version.json (build=${buildId}, hash=${searchIndexHash})`,
);
