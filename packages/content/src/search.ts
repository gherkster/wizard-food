import type { Recipe } from "./types";

/** The keys of the facets available for filtering on. */
export type FacetKey = keyof Pick<Recipe, "course" | "cuisine" | "diets">;
