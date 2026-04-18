import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { loadFeaturedRecipes, loadPagesContent, loadRecipesBySlug } from "@wizard/content";

const contentDirectory = ".content";

export const getHomePageData = createServerFn()
  .middleware([staticFunctionMiddleware])
  .handler(async () => {
    const content = await loadPagesContent(contentDirectory);

    const featuredRecipes = await loadFeaturedRecipes(contentDirectory);

    return {
      content: content.home,
      featuredRecipes,
    };
  });

export const getRecipesPageData = createServerFn()
  .middleware([staticFunctionMiddleware])
  .handler(async () => {
    const content = await loadPagesContent(contentDirectory);

    return content.recipes;
  });

export const getFeaturedRecipes = createServerFn()
  .middleware([staticFunctionMiddleware])
  .handler(async () => {
    return await loadFeaturedRecipes(contentDirectory);
  });

export const getRecipe = createServerFn()
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const recipes = await loadRecipesBySlug(contentDirectory);
    const recipe = recipes[data.slug];

    // if (!recipe) {
    //   throw new Error(`Recipe ${data.slug} not found.`);
    // }

    return recipe;
  });

// type ContentFileName =
//   | "recipes.by-slug.json"
//   | "recipes.all.json"
//   | "featured-recipes.json"
//   | "pages-content.json"
//   | "meta.json";

// const resolveContentFile = (fileName: ContentFileName, contentDir: string) => {
//   return path.join(path.resolve(contentDir), fileName);
// };

// const readJson = async <T>(fileName: ContentFileName, contentDir: string) => {
//   const filePath = resolveContentFile(fileName, contentDir);
//   const content = await fs.readFile(filePath, "utf8");

//   return JSON.parse(content) as T;
// };

// const loadRecipesBySlug = async (contentDir: string) => {
//   return readJson<Record<string, RecipePayload>>("recipes.by-slug.json", contentDir);
// };

// const loadFeaturedRecipes = async (contentDir: string) => {
//   return readJson<FeaturedRecipes>("featured-recipes.json", contentDir);
// };

// const loadPagesContent = async (contentDir: string) => {
//   return readJson<WebsitePagesContent>("pages-content.json", contentDir);
// };
