import { useDirectus } from "~/composables";

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
    .slice(0, 5);

  return {
    latest: latestRecipes,
  };
});
