import MiniSearch, { type SearchResult } from "minisearch";

import {
  searchIndexSettings,
  type SearchIndexRecipe,
  type SearchIndexSearchFields,
} from "~/utils/search";

// Store these outside the function in the global scope for re-use
const miniSearch = ref<MiniSearch<SearchIndexSearchFields>>();

export type RecipeSearchResult = SearchResult & SearchIndexRecipe;

export const useSearch = () => {
  const ensureIndex = async () => {
    if (miniSearch.value) {
      return;
    }

    verifySearchIndexIsCached();

    // If a valid copy of the search index wasn't found in localstorage,
    // Trigger an async download of the index in the background
    if (miniSearch.value === undefined) {
      await refreshIndex();
    }
  };

  const verifySearchIndexIsCached = () => {
    if (import.meta.client) {
      const storedIndex = localStorage.getItem("search-index");
      if (storedIndex) {
        loadIndex(storedIndex);
      }
    }
  };

  const refreshIndex = async () => {
    if (!import.meta.client) {
      return;
    }

    const { data: index } = await useFetch<JSON>("/search-index.json");
    if (index.value) {
      const jsonString = JSON.stringify(index.value);
      loadIndex(jsonString);

      localStorage.setItem("search-index", jsonString);
    }
  };

  const search = async (query: string) => {
    if (!miniSearch.value) {
      await ensureIndex();
    }

    if (!miniSearch.value) {
      return [];
    }

    return miniSearch.value.search(query, {
      // Match on the prefix of the result, not exact word matches. I.e. chick -> chicken
      prefix: true,
      // Don't use the default "OR" matching, which can match different recipes when the query includes spaces
      combineWith: "AND",
    }) as RecipeSearchResult[];
  };

  const allItems = async () => {
    if (!miniSearch.value) {
      await ensureIndex();
    }

    if (!miniSearch.value) {
      return [];
    }

    return miniSearch.value.search(MiniSearch.wildcard) as RecipeSearchResult[];
  };

  const loadIndex = (jsonString: string) => {
    try {
      miniSearch.value = MiniSearch.loadJSON(jsonString, searchIndexSettings);
      miniSearch.value.search("a"); // Do a search to validate this is a valid search index
    } catch (error) {
      miniSearch.value = undefined;
      console.error(error);
    }
  };

  return {
    allItems,
    ensureIndex,
    refreshIndex,
    search,
  };
};
