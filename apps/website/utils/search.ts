import type { Options } from "minisearch";

/** The minimal fields that are stored inside the recipe search index. */
export type RecipeSearchIndexEntry = {
  course: string;
  cuisine: string;
  diets: string[] | undefined;
  durationTotal: string | undefined;
  featuredTag: string | undefined;
  image: {
    height: number;
    sizes: string;
    src: string;
    srcSet: string;
    width: number;
  };
  slug: string;
  title: string;
};

export type RecipeSearchIndexSearchFields = Pick<RecipeSearchIndexEntry, "title">;

const exhaustiveKeys = <T>() => {
  return <U extends (keyof T)[]>(...keys: U & ([keyof T] extends [U[number]] ? U : never)) => keys;
};

// Type safe property name extraction
const searchIndexIdField: keyof RecipeSearchIndexEntry = "slug";

const searchIndexSearchFields = exhaustiveKeys<RecipeSearchIndexSearchFields>()("title");

const searchIndexStoredFields = exhaustiveKeys<RecipeSearchIndexEntry>()(
  "course",
  "cuisine",
  "diets",
  "durationTotal",
  "featuredTag",
  "image",
  "slug",
  "title",
);

export const searchIndexSettings: Options = {
  fields: searchIndexSearchFields,
  idField: searchIndexIdField,
  storeFields: searchIndexStoredFields,
};
