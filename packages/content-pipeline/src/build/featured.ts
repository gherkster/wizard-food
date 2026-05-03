import type { FeaturedRecipes, Recipe } from "@wizard/content";

import { mapToRecipePreview } from "../utils/mappings";
import { recipeTotalDuration } from "./formatting";

export const buildFeaturedRecipes = (rawRecipes: Recipe[]): FeaturedRecipes => {
  const recipePreviews = rawRecipes.map(mapToRecipePreview);

  if (recipePreviews.length === 0) {
    throw new Error("Failed to retrieve recipes");
  }

  const alreadyShownRecipes = new Set<string>();

  const now = new Date();

  const latestRecipes = recipePreviews
    .sort(
      (a, b) =>
        (b.datePublished ? new Date(b.datePublished) : now).getTime() -
        (a.datePublished ? new Date(a.datePublished) : now).getTime(),
    )
    .slice(0, 3);
  latestRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  const favouriteRecipes = shuffle(recipePreviews)
    .filter((r) => !alreadyShownRecipes.has(r.slug) && r.favourite)
    .slice(0, 4);
  favouriteRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  const quickRecipes = shuffle(recipePreviews)
    .filter((r) => {
      const totalDuration = recipeTotalDuration(r);
      return (
        !alreadyShownRecipes.has(r.slug) &&
        r.course?.toLowerCase().startsWith("main") &&
        totalDuration.asMinutes() > 0 &&
        totalDuration.asMinutes() <= 45
      );
    })
    .slice(0, 4);
  quickRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  const worldCuisineRecipes = shuffle(recipePreviews)
    .filter(
      (r) =>
        !alreadyShownRecipes.has(r.slug) &&
        !!r.cuisine &&
        !["american", "australian"].includes(r.cuisine.toLowerCase()),
    )
    .slice(0, 4);

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
