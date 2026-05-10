import type { FilterParams } from "~/composables/useSearch";

/**
 * Creates a formatted description string of the current search filters.
 * @param params The active search filter parameters.
 */
export const describeFilterCategories = (params: FilterParams) => {
  // Check if the user applied any category filters
  const hasAnyFilters = Object.values(params).filter(Boolean).length > 0;

  if (!hasAnyFilters) {
    return undefined;
  }

  const { diets, cuisine, course } = params;

  return buildFiltersPhrase({ diets, cuisine, course });
};

/**
 * Creates a formatted description string of the current search results.
 * @param params The active search parameters.
 * @param options.resultCount The number of results for the current search.
 */
export const describeSearchResults = (
  query: string | undefined,
  filterParams: FilterParams,
  options: { resultCount: number },
) => {
  // Check if the user applied any filters or queries
  const hasAnyInput = !!query || Object.values(filterParams).filter(Boolean).length > 0;

  if (!hasAnyInput) {
    return undefined;
  }

  const { diets, cuisine, course } = filterParams;

  const categoryPhrase = buildFiltersPhrase({ diets, cuisine, course });

  return options.resultCount > 0
    ? buildQueryResultsPrefix(categoryPhrase, query, options.resultCount)
    : buildNoResultsMessage(categoryPhrase, query, { hasAnyInput });
};

// Builds the category phrase (e.g., "Vegan Indian Mains" or "Indian recipes")
const buildFiltersPhrase = (values: {
  diets: string | undefined;
  cuisine: string | undefined;
  course: string | undefined;
}): string => {
  const { course, cuisine, diets } = values;

  const prefix = buildFilterPrefix({ diets, cuisine });

  const courseOrRecipes = course?.trim() || "recipes";

  if (prefix) {
    return `${prefix} ${courseOrRecipes}`;
  }

  return courseOrRecipes;
};

// Combines the non-target filter options into a string prefix
const buildFilterPrefix = (values: {
  diets: string | undefined;
  cuisine: string | undefined;
}): string => {
  const diet = values.diets?.trim();
  const cuisine = values.cuisine?.trim();

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
const buildQueryResultsPrefix = (
  categoryPhrase: string,
  query: string | undefined,
  resultCount: number,
) => {
  const resultLabel = resultCount <= 1 ? "result" : "results";

  const cleanQuery = query?.trim();
  if (!cleanQuery) {
    return `${resultCount} ${resultLabel} for ${categoryPhrase}`;
  }

  return `${resultCount} ${resultLabel} for "${cleanQuery}" in ${categoryPhrase}`;
};

// Builds the final "No results" message based on the descriptor.
const buildNoResultsMessage = (
  categoryPhrase: string,
  query: string | undefined,
  options: { hasAnyInput: boolean },
): string => {
  if (!options.hasAnyInput) {
    return "No results";
  }

  const cleanQuery = query?.trim();
  if (cleanQuery) {
    return `No results for "${cleanQuery}" in ${categoryPhrase}`;
  }

  return `No results for ${categoryPhrase}`;
};
