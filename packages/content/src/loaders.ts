import * as fs from "node:fs/promises";

import { type ContentFileName, resolveContentFile } from "./files";
import type { ContentMeta, Recipe, WebsitePagesContent } from "./types";

async function readJson<T>(fileName: ContentFileName, contentDir: string) {
  const filePath = resolveContentFile(fileName, contentDir);
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

export const loadAllRecipes = async (contentDir: string) => {
  return readJson<Record<string, Recipe>>("recipes.json", contentDir);
};

export const loadPagesContent = async (contentDir: string) => {
  return readJson<WebsitePagesContent>("pages-content.json", contentDir);
};

export const loadContentMeta = async (contentDir: string) => {
  return readJson<ContentMeta>("meta.json", contentDir);
};
