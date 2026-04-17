import type { HomePageData, RecipeDetailData, RecipesPageData } from "@/models/content";

const contentModules = import.meta.glob("../../.content/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

const getContentFile = <T>(name: string): T => {
  const entry = Object.entries(contentModules).find(([filePath]) => filePath.endsWith(`/${name}`));
  if (!entry) {
    throw new Error(`Missing .content file: ${name}`);
  }
  return entry[1] as T;
};

const pagesContent = getContentFile<Record<string, unknown>>("pages-content.json");
const featuredRecipes = getContentFile<HomePageData["featuredRecipes"]>("featured-recipes.json");
const recipesAll = getContentFile<RecipesPageData["recipes"]>("recipes.all.json");
const recipeBySlugRaw =
  getContentFile<Record<string, RecipeDetailData["recipe"]>>("recipes.by-slug.json");

const homePageData: HomePageData = {
  content: pagesContent.home as HomePageData["content"],
  featuredRecipes,
};

const recipesPageData: RecipesPageData = {
  content: pagesContent.recipes as RecipesPageData["content"],
  recipes: recipesAll,
};

const recipeDetailBySlug: Record<string, RecipeDetailData> = Object.fromEntries(
  Object.entries(recipeBySlugRaw).map(([slug, recipe]) => [slug, { recipe }]),
);

export const getHomePageData = async () => {
  return homePageData;
};

export const getRecipesPageData = async () => {
  return recipesPageData;
};

export const getRecipeDetailData = async (slug: string) => {
  return recipeDetailBySlug[slug] ?? null;
};
