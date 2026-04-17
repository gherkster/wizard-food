import type {
  FeaturedRecipes,
  RecipePayload,
  RecipePreview,
  WebsitePageContent,
} from "@wizard/content";

export type RecipeSearch = {
  search?: string;
  cuisine?: string;
  ingredient?: string;
  cookingStyle?: string;
  diet?: "vegetarian" | "vegan";
  prepTime?: "under-30" | "30-60" | "60-plus";
};

export type HomePageData = {
  content: WebsitePageContent;
  featuredRecipes: FeaturedRecipes;
};

export type RecipesPageData = {
  content: WebsitePageContent;
  recipes: RecipePreview[];
};

export type RecipeDetailData = {
  recipe: RecipePayload;
};
