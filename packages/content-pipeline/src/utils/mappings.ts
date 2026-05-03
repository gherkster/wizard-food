import type { Recipe, RecipePreview } from "@wizard/content";

import { formatDuration, recipeTotalDuration } from "../build/formatting";

export const mapToRecipePreview = (recipe: Recipe): RecipePreview => {
  return {
    cookingDuration: recipe.cookingDuration ?? undefined,
    course: recipe.course ?? undefined,
    cuisine: recipe.cuisine ?? undefined,
    customDuration: recipe.customDuration ?? undefined,
    customDurationName: recipe.customDurationName ?? undefined,
    datePublished: recipe.datePublished,
    descriptionSnippet: recipe.descriptionSnippet,
    favourite: recipe.favourite ?? undefined,
    featuredTag: recipe.featuredTag,
    preparationDuration: recipe.preparationDuration ?? undefined,
    previewImage: recipe.previewImage,
    slug: recipe.slug,
    tags: recipe.tags,
    title: recipe.title,
    totalDurationLabel: formatDuration(recipeTotalDuration(recipe)),
  };
};
