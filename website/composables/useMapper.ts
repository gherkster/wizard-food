import prand from "pure-rand";
import { useRecipeFormatter } from "./useRecipeFormatter";
import type { ServerImage, ServerRecipePreview } from "common/types/serverRecipe";
import type { Image, RecipePreview } from "~/types/recipe";

export function useMapper() {
  return {
    toRecipePreview,
  };
}

function toRecipePreview(serverRecipePreview: ServerRecipePreview): RecipePreview {
  return {
    title: serverRecipePreview.title,
    tags: buildTagList(serverRecipePreview),
    featuredTag: getRandomTag(serverRecipePreview),
    totalDuration: getTotalDuration(serverRecipePreview),
    coverImage: mapImage(serverRecipePreview.coverImage),
    slug: serverRecipePreview.slug,
  };
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
