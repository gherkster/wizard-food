import { useDirectus } from "~/composables/useDirectus";
import { RecipeMapper } from "~/mapping/recipeMapper";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const directusClient = useDirectus({
    url: config.baseUrl,
    clientId: config.cfAccessClientId,
    clientSecret: config.cfAccessClientSecret,
  });

  // TODO: Need to limit fields being requested/returned
  const recipes = await directusClient.getAllRecipes();
  return recipes.map((r) => RecipeMapper.toClientPreview(r));
});
