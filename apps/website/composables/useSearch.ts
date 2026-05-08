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

/** The search and filter query parameters. */
export type SearchParams = {
  /** The cuisine to search. */
  c: string;
  /** The diet to search. */
  d: string;
  /** The course (meal) to search. */
  m: string;
  /** The query text to search. */
  q: string;
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

  const activeParams = computed<Required<SearchParams>>(() => ({
    c: getQueryParam("c") ?? "",
    d: getQueryParam("d") ?? "",
    m: getQueryParam("m") ?? "",
    q: getQueryParam("q") ?? "",
  }));

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
      activeParams.value.q?.trim() || MiniSearch.wildcard,
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
        if (facet.check(recipe, activeParams.value)) {
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
   * Updates the current recipe search parameters.
   * @param updates The search parameters to filter the recipes by.
   * @param replaceHistory True if the search should be updated without adding to the browser history, or false if it should be tracked in history.
   */
  const updateSearch = async (updates: Partial<SearchParams>, replaceHistory = false) => {
    const newQuery: Record<string, string> = { ...route.query, ...updates };

    // Remove empty keys so the URL stays clean (e.g., no ?c=&m=)
    for (const key in newQuery) {
      if (!newQuery[key]) delete newQuery[key];
    }

    await navigateTo({
      path: "/recipes",
      query: newQuery,
      replace: replaceHistory,
    });
  };

  /** Clears the currently active search filters. */
  const clearFilters = async () => {
    await updateSearch(
      {
        c: "",
        d: "",
        m: "",
        q: "",
      },
      false,
    );
  };

  return {
    activeParams,
    clearFilters,
    init,
    isReady,
    options,
    results,
    sync,
    updateSearch,
  };
};

// The mapping of facets to the functions that determine if they match.
// This is implemented as a record to prompt type errors if the facets are changed,
// and outside the filter loops to avoid excessive allocations.
const filterFacetsByName: Record<
  FacetKey,
  (recipe: RecipeSearchResult, search: SearchParams) => boolean
> = {
  course: (recipe, { m }) => !m || recipe.course === m,
  cuisine: (recipe, { c }) => !c || recipe.cuisine === c,
  diets: (recipe, { d }) => !d || recipe.diets?.includes(d) === true,
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
