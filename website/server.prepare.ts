import { defineNuxtPrepareHandler } from "nuxt-prepare/config";
import { useDirectusApi } from "./server/utils/useDirectusApi";

export default defineNuxtPrepareHandler(async () => {
  const client = useDirectusApi();

  const { data: recipes, error } = await client.getRecipes();

  if (error) {
    throw error;
  }

  if (!recipes || recipes.length === 0) {
    throw "No recipes returned from CMS";
  }

  return {
    ok: !error && recipes.length > 0,
    state: {
      recipes: recipes,
    },
  };
});
