declare module "#content" {
  import type { RecipePayload, FeaturedRecipes, WebsitePageContent } from "@wizard/content/store";

  export const recipesBySlug: Record<string, RecipePayload | undefined>;
  export const featuredRecipes: FeaturedRecipes;
  export const homePageContent: WebsitePageContent;
  export const recipesPageContent: WebsitePageContent;
}
