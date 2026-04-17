import path from "node:path";

export type ContentFileName =
  | "recipes.by-slug.json"
  | "recipes.all.json"
  | "featured-recipes.json"
  | "pages-content.json"
  | "meta.json";

export const resolveContentFile = (fileName: ContentFileName, contentDir: string) => {
  return path.join(path.resolve(contentDir), fileName);
};
