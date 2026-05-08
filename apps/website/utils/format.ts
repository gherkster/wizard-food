import type { SearchParams } from "~/composables/useSearch";

/**
 * Creates a formatted summary string of the search results, based on the currently selected filters and search results.
 * @param params The active search parameters.
 * @param options.hasResults Whether there are greater than zero results for the current search.
 */
export const formatSearchSummary = (
  params: SearchParams,
  options: { hasResults: boolean },
): string => {
  // Check if the user applied any filters or queries
  const hasAnyInput = Object.values(params).filter(Boolean).length > 0;

  if (!hasAnyInput) {
    return "All recipes";
  }

  const { q: query, d: diet, c: cuisine, m: course } = params;

  const categoryPhrase = buildFiltersPhrase(diet, cuisine, course);

  if (options.hasResults) {
    return buildQueryResultsPrefix(categoryPhrase, query);
  } else {
    return buildNoResultsMessage(categoryPhrase, query, { hasAnyInput });
  }
};

// Builds the category phrase (e.g., "Vegan Indian Mains" or "Indian recipes")
const buildFiltersPhrase = (diet: string, cuisine: string, course: string): string => {
  const prefix = buildFilterPrefix({ diet, cuisine });

  const courseOrRecipes = course.trim() || "recipes";

  if (prefix) {
    return `${prefix} ${courseOrRecipes}`;
  }

  return courseOrRecipes;
};

// Combines the non-target filter options into a string prefix
const buildFilterPrefix = (values: { diet: string; cuisine: string }): string => {
  const diet = values.diet.trim();
  const cuisine = values.cuisine.trim();

  if (diet && cuisine) {
    return `${diet} ${cuisine}`;
  }
  if (diet) {
    return diet;
  }
  if (cuisine) {
    return cuisine;
  }

  return "";
};

// Prefixes the category phrase with the search query if one exists
const buildQueryResultsPrefix = (categoryPhrase: string, query?: string): string => {
  const cleanQuery = query?.trim();

  if (cleanQuery) {
    return `Results for "${cleanQuery}" in ${categoryPhrase}`;
  }

  return categoryPhrase;
};

// Builds the final "No results" message based on the descriptor.
const buildNoResultsMessage = (
  categoryPhrase: string,
  query: string,
  options: { hasAnyInput: boolean },
): string => {
  if (!options.hasAnyInput) {
    return "No results";
  }

  const cleanQuery = query.trim();
  if (cleanQuery) {
    return `No results for "${cleanQuery}" in ${categoryPhrase}`;
  }

  return `No results for ${categoryPhrase}`;
};
