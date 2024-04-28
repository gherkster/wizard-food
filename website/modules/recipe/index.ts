import type { ServerImage, ServerRecipePreview } from "common/types/serverRecipe";
import MiniSearch from "minisearch";
import { defineNuxtModule } from "nuxt/kit";
import prand from "pure-rand";
import { useDirectus, useRecipeFormatter } from "../../composables";
import type { Image, RecipePreview } from "../../types/recipe";
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

async function getAllRecipes() {
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

  return remoteRecipes.map((serverRecipe) => {
    return {
      title: serverRecipe.title,
      tags: buildTagList(serverRecipe),
      featuredTag: getRandomTag(serverRecipe),
      totalDuration: getTotalDuration(serverRecipe),
      coverImage: serverRecipe.coverImage ? mapImage(serverRecipe.coverImage) : undefined,
      slug: serverRecipe.slug,
    };
  });
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

function mapImage(serverImage: ServerImage): Image {
  return {
    id: serverImage.id,
    title: serverImage.title,
    width: serverImage.width,
    height: serverImage.height,
    modifyDate: serverImage.modified_on,
  };
}

function getRandomTag(recipe: ServerRecipePreview) {
  const tags = buildTagList(recipe);
  if (tags.length === 0) {
    return undefined;
  }

  // Is this randomness enough with incrementing integers?
  const randomness = prand.xoroshiro128plus(recipe.id);
  const [randomIndex] = prand.uniformIntDistribution(0, tags.length - 1, randomness);
  console.log(randomIndex);
  return tags[randomIndex];
}

const formatter = useRecipeFormatter();
function getTotalDuration(recipe: ServerRecipePreview) {
  return formatter.formatMinutesAsDuration(
    (recipe.preparationDuration ?? 0) + (recipe.cookingDuration ?? 0) + (recipe.customDuration ?? 0),
  );
}

function buildTagList(recipe: ServerRecipePreview): string[] {
  const tags: string[] = [];
  if (recipe.cuisine) {
    tags.push(recipe.cuisine);
  }
  if (recipe.course) {
    tags.push(recipe.course);
  }
  if (recipe.diets) {
    tags.push(...recipe.diets);
  }
  if (recipe.main_ingredients) {
    tags.push(...recipe.main_ingredients);
  }
  return tags.sort();
}
