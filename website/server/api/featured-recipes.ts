import { ServerRecipePreview } from "common/types/serverRecipe";
import { useDirectus, useMapper } from "~/composables";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const directusClient = useDirectus({
    url: config.baseUrl,
    clientId: config.cfAccessClientId,
    clientSecret: config.cfAccessClientSecret,
  });

  const recipes = await directusClient.getAllRecipes();

  // Track the recipes that have already been picked so far so that duplicates are not displayed
  const alreadyShownRecipes = new Set<number>();

  const latestRecipes = recipes
    .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
    .slice(0, 3);
  latestRecipes.forEach((r) => alreadyShownRecipes.add(r.id));

  const favouriteRecipes = shuffle(recipes)
    .filter((r) => !alreadyShownRecipes.has(r.id) && r.favourite)
    .slice(0, 4);
  favouriteRecipes.forEach((r) => alreadyShownRecipes.add(r.id));

  const quickRecipes = shuffle(recipes).filter(
    (r) =>
      !alreadyShownRecipes.has(r.id) &&
      r.course?.toLowerCase().startsWith("main") &&
      getTotalDuration(r) > 0 &&
      getTotalDuration(r) <= 45,
  );
  quickRecipes.forEach((r) => alreadyShownRecipes.add(r.id));

  // TODO: Probably needs to cover more cuisines
  const worldCuisines = shuffle(recipes).filter(
    (r) => !alreadyShownRecipes.has(r.id) && r.cuisine && !["american", "australian"].includes(r.cuisine.toLowerCase()),
  );

  const mapper = useMapper();

  return {
    latestRecipes: latestRecipes.map(mapper.toRecipePreview),
    favouriteRecipes: favouriteRecipes.map(mapper.toRecipePreview),
    quickRecipes: quickRecipes.map(mapper.toRecipePreview),
    worldCuisineRecipes: worldCuisines.map(mapper.toRecipePreview),
  };
});

// https://stackoverflow.com/a/46545530
function shuffle<Type>(items: Type[]) {
  return items
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function getTotalDuration(recipe: ServerRecipePreview) {
  return (recipe.preparationDuration ?? 0) + (recipe.cookingDuration ?? 0) + (recipe.customDuration ?? 0);
}
