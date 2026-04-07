import type { FeaturedRecipes, RecipePayload, RecipePreview } from "@wizard/content/store";

import { formatDuration, recipeTotalDuration } from "./formatting";

const mapToRecipePreview = (recipe: RecipePayload): RecipePreview => {
  return {
    title: recipe.title,
    descriptionSnippet: recipe.descriptionSnippet,
    course: recipe.course ?? undefined,
    cuisine: recipe.cuisine ?? undefined,
    datePublished: recipe.datePublished,
    favourite: recipe.favourite ?? undefined,
    featuredTag: recipe.featuredTag,
    preparationDuration: recipe.preparationDuration ?? undefined,
    cookingDuration: recipe.cookingDuration ?? undefined,
    customDurationName: recipe.customDurationName ?? undefined,
    customDuration: recipe.customDuration ?? undefined,
    totalDurationLabel: formatDuration(recipeTotalDuration(recipe)),
    coverImage: recipe.coverImage,
    slug: recipe.slug,
    tags: recipe.tags,
  };
};

export const buildFeaturedRecipes = (recipePayloads: RecipePayload[]): FeaturedRecipes => {
  const recipes = (recipePayloads ?? []).map((r) => mapToRecipePreview(r));

  if (recipes.length === 0) {
    throw new Error("Failed to retrieve recipes");
  }

  const alreadyShownRecipes = new Set<string>();

  const now = new Date();

  const latestRecipes = recipes
    .sort(
      (a, b) =>
        (b.datePublished ? new Date(b.datePublished) : now).getTime() -
        (a.datePublished ? new Date(a.datePublished) : now).getTime(),
    )
    .slice(0, 3);
  latestRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  const favouriteRecipes = shuffle(recipes)
    .filter((r) => !alreadyShownRecipes.has(r.slug) && r.favourite)
    .slice(0, 4);
  favouriteRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  const quickRecipes = shuffle(recipes)
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

  const worldCuisineRecipes = shuffle(recipes)
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
