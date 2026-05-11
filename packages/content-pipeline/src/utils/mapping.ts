import type { Recipe, RecipePreview } from "@wizard/content";

export const mapToRecipePreview = (recipe: Recipe): RecipePreview => {
  return {
    course: recipe.course ?? undefined,
    cuisine: recipe.cuisine ?? undefined,
    diets: recipe.diets,
    durationTotal: recipe.durationTotal,
    featuredTag: recipe.featuredTag,
    previewImage: recipe.previewImage,
    slug: recipe.slug,
    title: recipe.title,
  };
};
