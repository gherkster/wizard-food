import type { ImageVariant } from "@wizard/content/store";
import type { Options } from "minisearch";

/** The minimal fields that are stored inside the recipe search index. */
export interface SearchIndexRecipe {
  title: string;
  coverImage: {
    height: number;
    width: number;
    previewSquare: ImageVariant;
  };
  slug: string;
  tags: string[];
  featuredTag?: string;
  totalDurationLabel?: string;
}

export type SearchIndexSearchFields = Pick<SearchIndexRecipe, "title" | "tags">;

// Type safe property name extraction
const searchIndexIdField: keyof SearchIndexRecipe = "slug";

const searchIndexIndexedFields: (keyof SearchIndexSearchFields)[] = ["title", "tags"];
const searchIndexStoredFields: (keyof SearchIndexRecipe)[] = [
  "slug",
  "title",
  "tags",
  "featuredTag",
  "totalDurationLabel",
  "coverImage",
];

export const searchIndexSettings: Options = {
  fields: searchIndexIndexedFields,
  idField: searchIndexIdField,
  storeFields: searchIndexStoredFields,
};
