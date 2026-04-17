import type { Options } from "minisearch";
import type { ImageVariant } from "@wizard/content";

export type SearchIndexRecipe = {
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
  cuisine?: string;
  diets?: string[];
  mainIngredients?: string[];
  cookingStyle?: string;
};

export type SearchIndexSearchFields = Pick<SearchIndexRecipe, "title" | "tags">;

const searchIndexIdField: keyof SearchIndexRecipe = "slug";
const searchIndexIndexedFields: (keyof SearchIndexSearchFields)[] = ["title", "tags"];
const searchIndexStoredFields: (keyof SearchIndexRecipe)[] = [
  "slug",
  "title",
  "tags",
  "featuredTag",
  "totalDurationLabel",
  "cuisine",
  "diets",
  "mainIngredients",
  "cookingStyle",
  "coverImage",
];

export const searchIndexSettings: Options = {
  fields: searchIndexIndexedFields,
  idField: searchIndexIdField,
  storeFields: searchIndexStoredFields,
};
