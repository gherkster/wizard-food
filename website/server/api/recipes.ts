import { useDirectus } from "~/composables/useDirectus";
import { RecipeMapper } from "~/mapping/recipeMapper";
import type { RecipeListResponse } from "~/types/recipe";

export default defineEventHandler<Promise<RecipeListResponse>>(async (event) => {
  const config = useRuntimeConfig(event);

  const directusClient = useDirectus({
    url: config.baseUrl,
    clientId: config.cfAccessClientId,
    clientSecret: config.cfAccessClientSecret,
  });

  // TODO: Need to limit fields being requested/returned
  const recipes = await directusClient.getAllRecipes();
  const response: RecipeListResponse = {
    meta: {
      cuisines: recipes
        .map((r) => r.cuisine ?? "")
        .filter((r) => r)
        .filter(unique)
        .sort(),
      courses: recipes
        .map((r) => r.course ?? "")
        .filter((c) => c)
        .filter(unique)
        .sort(),
      diets: recipes
        .flatMap((r) => r.diets ?? "")
        .filter((d) => d)
        .filter(unique)
        .sort(),
      mainIngredients: recipes
        .flatMap((r) => r.main_ingredients ?? "")
        .filter((mi) => mi)
        .filter(unique)
        .sort(),
    },
    recipes: recipes.map((r) => RecipeMapper.toClientPreview(r)),
  };

  return response;
});

function unique(value: string, index: number, items: string[]) {
  return items.indexOf(value) === index;
}
