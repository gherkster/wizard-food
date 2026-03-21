import type { Options } from "minisearch";
import type { SearchIndexRecipe } from "../types/recipe";

export type SearchIndexSearchFields = Pick<SearchIndexRecipe, "title" | "tags">;

// Type safe property name extraction
const searchIndexIdField: keyof SearchIndexRecipe = "slug";

const emptySearchIndexIndexedFields: SearchIndexSearchFields = {
  title: "",
  tags: [],
};
const searchIndexIndexedFields = Object.keys(emptySearchIndexIndexedFields);

const emptySearchIndexStoredFields: SearchIndexRecipe = {
  title: "",
  coverImage: {
    id: "",
    fileName: "",
    height: 0,
    width: 0,
    modifyDate: "",
  },
  slug: "",
  tags: [],
  featuredTag: "",
  totalDurationLabel: "",
};
const searchIndexStoredFields = Object.keys(emptySearchIndexStoredFields);

export const searchIndexSettings: Options = {
  idField: searchIndexIdField,
  fields: searchIndexIndexedFields,
  storeFields: searchIndexStoredFields,
};
