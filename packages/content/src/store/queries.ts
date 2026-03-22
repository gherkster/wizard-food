import {
  loadAllRecipes,
  loadContentMeta,
  loadFeaturedRecipes,
  loadPagesContent,
  loadRecipesBySlug,
} from "./loaders";

export const getAllRecipes = async (contentDir?: string) => {
  return loadAllRecipes(contentDir);
};

export const getFeaturedRecipes = async (contentDir?: string) => {
  return loadFeaturedRecipes(contentDir);
};

export const getRecipeBySlug = async (slug: string, contentDir?: string) => {
  const recipes = await loadRecipesBySlug(contentDir);
  return recipes[slug];
};

export const getPagesContent = async (contentDir?: string) => {
  return loadPagesContent(contentDir);
};

export const getPageContent = async (page: "home" | "recipes", contentDir?: string) => {
  const pages = await loadPagesContent(contentDir);
  return pages[page];
};

export const getContentMeta = async (contentDir?: string) => {
  return loadContentMeta(contentDir);
};
