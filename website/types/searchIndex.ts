import type { ServerRecipe } from "common/types/serverRecipe";
import type { Options } from "minisearch";

export type SearchIndexIndexed = Pick<ServerRecipe, "title">;
export type SearchIndexStoredFields = Pick<ServerRecipe, "title" | "coverImage">;

// Type safe property name extraction
const searchIndexIdField: keyof ServerRecipe = "slug";

const emptySearchIndexIndexedFields: SearchIndexIndexed = {
  title: "",
};
const searchIndexIndexedFields = Object.keys(emptySearchIndexIndexedFields);

const emptySearchIndexStoredFields: SearchIndexStoredFields = {
  title: "",
  coverImage: {
    id: "",
    title: "",
    height: 0,
    width: 0,
    modified_on: "",
  },
};
const searchIndexStoredFields = Object.keys(emptySearchIndexStoredFields);

export const searchIndexSettings: Options = {
  idField: searchIndexIdField,
  fields: searchIndexIndexedFields,
  storeFields: searchIndexStoredFields,
};
