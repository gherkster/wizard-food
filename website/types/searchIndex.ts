import type { ServerRecipe } from "common/types/serverRecipe";
import type { Options } from "minisearch";

export type SearchIndexIndexed = Pick<ServerRecipe, "title">;
type SearchIndexStored = Pick<ServerRecipe, "title" | "coverImage">;

// Type safe property name extraction
const searchIndexIdField: keyof ServerRecipe = "slug";

const emptySearchIndexIndexedFields: SearchIndexIndexed = {
  title: "",
};
const searchIndexIndexedFields = Object.keys(emptySearchIndexIndexedFields);

const emptySearchIndexStoredFields: SearchIndexStored = {
  title: "",
  coverImage: undefined,
};
const searchIndexStoredFields = Object.keys(emptySearchIndexStoredFields);

export const searchIndexSettings: Options = {
  idField: searchIndexIdField,
  fields: searchIndexIndexedFields,
  storeFields: searchIndexStoredFields,
};
