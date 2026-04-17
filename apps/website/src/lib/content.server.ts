import path from "node:path";

import {
  getAllRecipes,
  getPageContent,
  getRecipeBySlug,
  getFeaturedRecipes,
} from "@wizard/content";

const getContentDir = () => {
  if (process.env.CONTENT_DIR) {
    return process.env.CONTENT_DIR;
  }

  return path.resolve(process.cwd(), ".content");
};

const normalizeRecipe = (recipe: NonNullable<Awaited<ReturnType<typeof getRecipeBySlug>>>) => {
  return {
    ...recipe,
    diets: recipe.diets && typeof recipe.diets === "object" ? recipe.diets : undefined,
    main_ingredients:
      recipe.main_ingredients && typeof recipe.main_ingredients === "object"
        ? recipe.main_ingredients
        : undefined,
  };
};

export const loadHomePageData = async () => {
  const contentDir = getContentDir();
  const [content, featuredRecipes] = await Promise.all([
    getPageContent("home", contentDir),
    getFeaturedRecipes(contentDir),
  ]);

  return {
    content,
    featuredRecipes,
  };
};

export const loadRecipesPageData = async () => {
  const contentDir = getContentDir();
  const [content, recipes] = await Promise.all([
    getPageContent("recipes", contentDir),
    getAllRecipes(contentDir),
  ]);

  return {
    content,
    recipes,
  };
};

export const loadRecipeDetailData = async (slug: string) => {
  const contentDir = getContentDir();
  const recipe = await getRecipeBySlug(slug, contentDir);

  if (!recipe) {
    return null;
  }

  return {
    recipe: normalizeRecipe(recipe),
  };
};
