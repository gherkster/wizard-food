import path from "node:path";
import fs from "node:fs/promises";

const getContentDir = () => {
  if (process.env.CONTENT_DIR) {
    return process.env.CONTENT_DIR;
  }
  return path.resolve(process.cwd(), ".content");
};

export const getPrerenderPages = async () => {
  const recipesBySlugFile = path.join(getContentDir(), "recipes.by-slug.json");
  const recipesBySlug = JSON.parse(await fs.readFile(recipesBySlugFile, "utf8")) as Record<
    string,
    unknown
  >;
  const recipePages = Object.keys(recipesBySlug)
    .map((slug) => `/recipes/${slug}`)
    .sort((a, b) => a.localeCompare(b));

  return [
    { path: "/" },
    { path: "/recipes" },
    ...recipePages.map((pagePath) => ({ path: pagePath })),
  ];
};
