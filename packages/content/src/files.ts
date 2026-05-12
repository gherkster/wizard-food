import path from "node:path";

export type ContentFileName = "recipes.json" | "pages-content.json" | "meta.json";

const resolveContentDir = (contentDir?: string) => {
  return path.resolve(
    contentDir ?? process.env.CONTENT_DIR ?? path.join(process.cwd(), ".content"),
  );
};

export const resolveContentFile = (fileName: ContentFileName, contentDir?: string) => {
  return path.join(resolveContentDir(contentDir), fileName);
};
