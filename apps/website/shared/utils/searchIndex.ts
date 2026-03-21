import type { Options } from "minisearch";
import type { SearchIndexRecipe } from "../types/recipe";

export type SearchIndexSearchFields = Pick<SearchIndexRecipe, "title" | "tags">;

// Type safe property name extraction
const searchIndexIdField: keyof SearchIndexRecipe = "slug";

const searchIndexIndexedFields: Array<keyof SearchIndexSearchFields> = ["title", "tags"];
const searchIndexStoredFields: Array<keyof SearchIndexRecipe> = [
  "slug",
  "title",
  "tags",
  "featuredTag",
  "totalDurationLabel",
  "coverImage",
];

export const searchIndexSettings: Options = {
  idField: searchIndexIdField,
  fields: searchIndexIndexedFields,
  storeFields: searchIndexStoredFields,
};
