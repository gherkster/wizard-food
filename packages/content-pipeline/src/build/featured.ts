import type { FeaturedRecipes, Recipe } from "@wizard/content";

import { mapToRecipePreview } from "../utils/mapping";

export const buildFeaturedRecipes = (recipes: Recipe[]): FeaturedRecipes => {
  if (recipes.length === 0) {
    throw new Error("Failed to retrieve recipes");
  }

  // Keep track of what has been included in a category already to avoid doubling up
  const alreadyShownRecipes = new Set<string>();

  const now = new Date();

  const latestRecipes = recipes
    .sort(
      (a, b) =>
        (b.datePublished ? new Date(b.datePublished) : now).getTime() -
        (a.datePublished ? new Date(a.datePublished) : now).getTime(),
    )
    .slice(0, 3)
    .map(mapToRecipePreview);

  latestRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  const favouriteRecipes = shuffle(recipes)
    .filter((r) => !alreadyShownRecipes.has(r.slug) && r.favourite)
    .slice(0, 4)
    .map(mapToRecipePreview);

  favouriteRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  const quickRecipes = shuffle(recipes)
    .filter((r) => {
      return (
        !alreadyShownRecipes.has(r.slug) &&
        r.course?.toLowerCase().startsWith("main") &&
        r.durationTotal?.minutes !== undefined &&
        r.durationTotal.minutes > 0 &&
        r.durationTotal.minutes <= 45
      );
    })
    .slice(0, 4)
    .map(mapToRecipePreview);

  quickRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  const worldCuisineRecipes = shuffle(recipes)
    .filter(
      (r) =>
        !alreadyShownRecipes.has(r.slug) &&
        !!r.cuisine &&
        !["american", "australian"].includes(r.cuisine.toLowerCase()),
    )
    .slice(0, 4)
    .map(mapToRecipePreview);

  return {
    latestRecipes,
    favouriteRecipes,
    quickRecipes,
    worldCuisineRecipes,
  };
};

function shuffle<Type>(items: Type[]): Type[] {
  return items
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
