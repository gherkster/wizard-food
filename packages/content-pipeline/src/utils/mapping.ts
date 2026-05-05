import type { Recipe, RecipePreview } from "@wizard/content";

export const mapToRecipePreview = (recipe: Recipe): RecipePreview => {
  return {
    course: recipe.course ?? undefined,
    cuisine: recipe.cuisine ?? undefined,
    datePublished: recipe.datePublished,
    descriptionSnippet: recipe.descriptionSnippet,
    durationComponents: recipe.durationComponents,
    durationTotal: recipe.durationTotal,
    favourite: recipe.favourite ?? undefined,
    featuredTag: recipe.featuredTag,
    previewImage: recipe.previewImage,
    slug: recipe.slug,
    tags: recipe.tags,
    title: recipe.title,
  };
};
