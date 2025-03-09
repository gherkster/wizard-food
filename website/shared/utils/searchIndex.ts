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

export type SearchIndexStoredFields = {
  title: string;
  coverImage: {
    id: string;
    height: number;
    width: number;
    modifyDate: string;
    // Assign to never so these properties are not accidentally included in the search index, as they are not needed and bloat the size of the client side index
    title?: never;
    metadata?: never;
  };
  slug: string;
  tags: string[];
  featuredTag?: string;
  totalDuration?: string;
};

const emptySearchIndexStoredFields: SearchIndexStoredFields = {
  title: "",
  coverImage: {
    id: "",
    height: 0,
    width: 0,
    modifyDate: "",
  },
  slug: "",
  tags: [],
  featuredTag: "",
  totalDuration: "",
};
const searchIndexStoredFields = Object.keys(emptySearchIndexStoredFields);

export const searchIndexSettings: Options = {
  idField: searchIndexIdField,
  fields: searchIndexIndexedFields,
  storeFields: searchIndexStoredFields,
};
