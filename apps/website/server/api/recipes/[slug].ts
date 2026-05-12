import { loadAllRecipes } from "@wizard/content";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw new Error("Recipe slug is required");
  }

  const recipes = await loadAllRecipes(".content");

  return recipes[slug];
});
