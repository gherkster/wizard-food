import MiniSearch, { type SearchResult } from "minisearch";

import type { SelectOption } from "~/types/form";
import { getQueryParam } from "~/utils/route";
import {
  searchIndexSettings,
  type RecipeSearchIndexEntry,
  type RecipeSearchIndexSearchFields,
} from "~/utils/search";

/** The keys of the facets available for filtering on. */
export type FacetKey = keyof Pick<RecipeSearchIndexEntry, "course" | "cuisine" | "diets">;
type Facets = Record<FacetKey, string[]>;

/** The filter parameters. */
export type FilterParams = Record<FacetKey, string | undefined>;

/** The search and filter query parameters. */
export type FilterQueryParams = {
  /** The cuisine to search. */
  c: string | undefined;
  /** The diet to search. */
  d: string | undefined;
  /** The course (meal) to search. */
  m: string | undefined;
};

export type TermQueryParams = {
  /** The query text to search. */
  q: string | undefined;
};

export type RecipeSearchResult = SearchResult & RecipeSearchIndexEntry;

// The global search index instance
let miniSearchIndex: MiniSearch<RecipeSearchIndexSearchFields> | null = null;

export const useSearch = () => {
  const route = useRoute();

  /** The current recipe search results, based on the active filters. */
  const results = useState<RecipeSearchResult[]>("search-results", () => []);

  /** The recipe search facets. */
  const facets = useState<Facets>("search-facets", () => ({
    cuisine: [],
    course: [],
    diets: [],
  }));

  const options = useState<Record<FacetKey, SelectOption[]>>("search-facet-options", () => ({
    cuisine: [],
    course: [],
    diets: [],
  }));

  const activeFilters = computed<FilterParams>(() => ({
    cuisine: getQueryParam("c"),
    diets: getQueryParam("d"),
    course: getQueryParam("m"),
  }));

  const activeQuery = computed(() => getQueryParam("q"));

  const isReady = useState("search-ready", () => false);

  /** Initialises the search index, hydrating the cached search index if present, otherwise fetching from the server. */
  const init = async () => {
    if (isReady.value) {
      return;
    }

    if (!import.meta.client) {
      return;
    }

    try {
      const cachedSearchIndexJson = localStorage.getItem("search-index");
      if (cachedSearchIndexJson) {
        hydrate(cachedSearchIndexJson);
      } else {
        await sync();
      }

      isReady.value = true;

      // Populate the initial set of search results
      await refresh();
    } catch (e) {
      console.error("Search init failed", e);
    }
  };

  /** Hydrates the search index using the JSON of the serialised search index. */
  const hydrate = (searchIndexJson: string) => {
    miniSearchIndex = MiniSearch.loadJSON<RecipeSearchIndexSearchFields>(
      searchIndexJson,
      searchIndexSettings,
    );

    const all = miniSearchIndex.search(MiniSearch.wildcard) as RecipeSearchResult[];

    // Generate the facets and the available options for each
    facets.value = {
      cuisine: [...new Set(all.map((r) => r.cuisine).filter(Boolean))].sort(),
      course: [...new Set(all.map((r) => r.course).filter(Boolean))].sort(),
      diets: [...new Set(all.flatMap((r) => r.diets || []))].sort(),
    };
  };

  /** Syncs the search index with the server by fetching the latest JSON of the serialised search index. */
  const sync = async () => {
    if (!import.meta.client) {
      return;
    }

    const searchIndexJson = await $fetch<string>("/search-index.json", {
      responseType: "text",
    });

    if (!searchIndexJson) {
      console.warn("Empty search index response.");
      return;
    }

    hydrate(searchIndexJson);

    localStorage.setItem("search-index", searchIndexJson);
  };

  /** Refreshes the search index results by performing a search against the current search filters. */
  const refresh = async () => {
    if (!isReady.value || !miniSearchIndex) {
      return;
    }

    // Get the recipes matching the text search, or all recipes if there is no current text search filter
    // This is required below to calculate both the filtered search results, as well as the available facets for filtering
    const querySearchResults = miniSearchIndex.search(
      activeQuery.value?.trim() || MiniSearch.wildcard,
      {
        combineWith: "AND", // Don't use the default "OR" matching, which can match different recipes when the query includes spaces
        prefix: true, // Match on the prefix of the result, not exact word matches. I.e. chick -> chicken
      },
    ) as RecipeSearchResult[];

    const newResults: RecipeSearchResult[] = [];

    const validFacets = {
      cuisine: new Set<string>(),
      course: new Set<string>(),
      diets: new Set<string>(),
    };

    for (const recipe of querySearchResults) {
      let matchedFacetsCount = 0;
      let lastFailedKey: FacetKey | undefined;

      for (let i = 0; i < filterFacets.length; i++) {
        const facet = filterFacets[i]!;
        if (facet.check(recipe, activeFilters.value)) {
          matchedFacetsCount++;
        } else {
          lastFailedKey = facet.key;
        }
      }

      // If the recipe matches all facet filters, include it in the search results
      if (matchedFacetsCount === filterFacets.length) {
        newResults.push(recipe);

        for (let i = 0; i < filterFacets.length; i++) {
          addToFacetOptions(recipe, filterFacets[i]!.key, validFacets);
        }
      } else if (matchedFacetsCount === filterFacets.length - 1 && lastFailedKey) {
        /**
         * This is an implementation of smart facets.
         *
         * If this recipe matches all but one of the currently active filters,
         * then it's a valid operation to switch the filter from its current value to that new value,
         * since it will then match all active filters.
         *
         * By doing this, we build up the full set of available options based on the currently selected filters.
         * It avoids presenting options that would result in zero results being displayed.
         */
        addToFacetOptions(recipe, lastFailedKey, validFacets);
      }
    }

    const newOptions: Record<FacetKey, SelectOption[]> = { cuisine: [], course: [], diets: [] };

    for (let i = 0; i < filterFacets.length; i++) {
      const key = filterFacets[i]!.key;

      newOptions[key] = facets.value[key].map((val) => ({
        label: val,
        value: val,
        disabled: !validFacets[key].has(val),
      }));
    }

    results.value = newResults;
    options.value = newOptions;
  };

  // Watch the current query parameters to ensure the search results stay in sync
  watch(
    () => route.query,
    () => refresh(),
    { immediate: true },
  );

  /**
   * Updates the current recipe search filter parameters.
   * @param updates The parameters to filter the recipes by.
   * @param replaceHistory True if the search should be updated without adding to the browser history, or false if it should be tracked in history.
   */
  const updateFilters = async (updates: Partial<FilterParams>, replaceHistory = false) => {
    const queryParams: FilterQueryParams = {
      c: updates?.cuisine,
      d: updates?.diets,
      m: updates?.course,
    };

    await updateQueryParameters(queryParams, replaceHistory);
  };

  /**
   * Updates the current recipe search term parameters.
   * @param updates The parameters to query the recipes by.
   * @param replaceHistory True if the search should be updated without adding to the browser history, or false if it should be tracked in history.
   */
  const updateQuery = async (query: string | undefined, replaceHistory = false) => {
    const queryParams: TermQueryParams = {
      q: query,
    };

    await updateQueryParameters(queryParams, replaceHistory);
  };

  const updateQueryParameters = async (
    queryParams: Record<string, string | undefined>,
    replaceHistory = false,
  ) => {
    // Remove keys with undefined values to avoid removing existing query params during merging
    stripUndefined(queryParams);

    const newQueryParams = { ...route.query, ...queryParams };

    // Remove empty keys so the URL stays clean (e.g., no ?c=&m=)
    stripUndefined(newQueryParams);

    await navigateTo({
      path: "/recipes",
      query: newQueryParams,
      replace: replaceHistory,
    });
  };

  const stripUndefined = <T extends object>(obj: T) => {
    for (const key in obj) {
      if (obj[key] === undefined) {
        delete obj[key];
      }
    }
  };

  /** Clears the currently active search filters. */
  const clearFilters = async () => {
    await updateFilters(
      {
        course: "",
        cuisine: "",
        diets: "",
      },
      false,
    );
  };

  return {
    activeFilters,
    activeQuery,
    clearFilters,
    init,
    isReady,
    options,
    results,
    sync,
    updateFilters,
    updateQuery,
  };
};

// The mapping of facets to the functions that determine if they match.
// This is implemented as a record to prompt type errors if the facets are changed,
// and outside the filter loops to avoid excessive allocations.
const filterFacetsByName: Record<
  FacetKey,
  (recipe: RecipeSearchResult, search: FilterParams) => boolean
> = {
  course: (recipe, { course }) => !course || recipe.course === course,
  cuisine: (recipe, { cuisine }) => !cuisine || recipe.cuisine === cuisine,
  diets: (recipe, { diets }) => !diets || recipe.diets?.includes(diets) === true,
};

// The array form of the facet matching function map.
const filterFacets = (Object.keys(filterFacetsByName) as FacetKey[]).map((key) => ({
  key,
  check: filterFacetsByName[key],
}));

// Adds a string or array of string options to the selectable options for a given search facet.
const addToFacetOptions = (
  recipe: RecipeSearchResult,
  key: FacetKey,
  options: Record<FacetKey, Set<string>>,
) => {
  const val = recipe[key];
  if (val === undefined) return;

  if (Array.isArray(val)) {
    for (let i = 0; i < val.length; i++) {
      options[key].add(val[i]!);
    }
  } else {
    options[key].add(val);
  }
};
