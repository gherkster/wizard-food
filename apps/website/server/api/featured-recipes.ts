import { loadFeaturedRecipes } from "@wizard/content";

export default defineEventHandler(async () => {
  return await loadFeaturedRecipes(".content");
});
