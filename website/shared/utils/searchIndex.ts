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
    title: string;
    height: number;
    width: number;
    modifyDate: string;
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
    title: "",
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
