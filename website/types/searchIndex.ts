import { ServerRecipe } from "~/types/serverRecipe";
import { Options } from "minisearch";

export type SearchIndexIndexed = Pick<ServerRecipe, "title">;
export type SearchIndexStored = Pick<ServerRecipe, "title">;

// Type safe property name extraction
const searchIndexIdField: keyof ServerRecipe = "slug";

const emptySearchIndexIndexedFields: SearchIndexIndexed = {
  title: "",
};
const searchIndexIndexedFields = Object.keys(emptySearchIndexIndexedFields);

const emptySearchIndexStoredFields: SearchIndexStored = {
  title: "",
};
const searchIndexStoredFields = Object.keys(emptySearchIndexStoredFields);

export const searchIndexSettings: Options = {
  idField: searchIndexIdField,
  fields: searchIndexIndexedFields,
  storeFields: searchIndexStoredFields,
};
