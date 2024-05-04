import type { Type } from "typescript";
import { useDirectus, useMapper } from "~/composables";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const directusClient = useDirectus({
    url: config.baseUrl,
    clientId: config.cfAccessClientId,
    clientSecret: config.cfAccessClientSecret,
  });

  const recipes = await directusClient.getAllRecipes();

  const latestRecipes = recipes
    .sort((a, b) => new Date(a.date_created).getSeconds() - new Date(b.date_created).getSeconds())
    .slice(0, 3);

  // TODO: Filter out any recipes that exist in previous collections to ensure recipes aren't shown twice.
  // This can be done once testing is done
  const favouriteRecipes = recipes.filter((r) => r.favourite);

  const mapper = useMapper();

  return {
    latestRecipes: latestRecipes.map(mapper.toRecipePreview),
    favouriteRecipes: shuffleItems(favouriteRecipes).slice(0, 3).map(mapper.toRecipePreview),
  };
});

// https://stackoverflow.com/a/46545530
function shuffleItems<Type>(items: Type[]) {
  return items
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
