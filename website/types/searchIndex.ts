import type { Options } from "minisearch";
import type { RecipePreview } from "./recipe";

export type SearchIndexIndexed = Pick<RecipePreview, "title" | "tags">;

// Type safe property name extraction
const searchIndexIdField: keyof RecipePreview = "slug";

const emptySearchIndexIndexedFields: SearchIndexIndexed = {
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
