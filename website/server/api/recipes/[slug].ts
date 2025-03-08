import type { RecipePayload } from "~~/shared/types/recipe";
import { recipes } from "~~/.nuxt/module/nuxt-prepare";

export default defineEventHandler(async (event): Promise<RecipePayload> => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug is a required parameter",
    });
  }

  return findRecipe(recipes, slug);
});

const findRecipe = (recipes: RecipePayload[], recipeSlug: string) => {
  const recipe = recipes.find((r) => r.slug === recipeSlug);

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found",
    });
  }

  return recipe;
};
