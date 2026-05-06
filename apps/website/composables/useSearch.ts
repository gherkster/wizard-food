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
  /** Ensures that the search index exists in local storage, retrieving it from the server if not. */
  const ensureIndex = async () => {
    if (miniSearch.value) {
      return;
    }

    const cachedInstance = getCachedSearchIndex();

    if (cachedInstance) {
      miniSearch.value = cachedInstance;
    } else {
      // If a valid copy of the search index wasn't found in localstorage, then fetch and generate the local search index
      await refreshIndex();
    }
  };

  /**
   * Refreshes the search index by downloading the latest copy from the server, and replacing the copy in local storage if successful.
   */
  const refreshIndex = async () => {
    if (!import.meta.client) {
      // The server doesn't need a search index in local dev, and leads to 404 Page not found errors if enabled
      return;
    }

    const searchIndex = await fetchSearchIndex();

    if (searchIndex) {
      cacheSearchIndex(searchIndex);
    }
  };

  const fetchSearchIndex = async () => {
    const searchIndexJson = await $fetch<string>("/search-index.json", {
      responseType: "text", // Don't bother deserialising when we need the raw string
    });

    if (!searchIndexJson) {
      console.warn("Empty search index response.");
      return;
    }

    return createSearchIndex(searchIndexJson);
  };

  /**
   * Searches the recipe search index for a given query.
   * @param query The string to prefix search for in the recipe search index.
   * @returns The search results matching the given search query.
   */
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

  /** Returns all items in the search index. */
  const allItems = async () => {
    if (!miniSearch.value) {
      await ensureIndex();
    }

    if (!miniSearch.value) {
      return [];
    }

    return miniSearch.value.search(MiniSearch.wildcard) as RecipeSearchResult[];
  };

  return {
    allItems,
    ensureIndex,
    refreshIndex,
    search,
  };
};

const createSearchIndex = (jsonString: string) => {
  try {
    const searchClient = MiniSearch.loadJSON<SearchIndexSearchFields>(
      jsonString,
      searchIndexSettings,
    );
    searchClient.search("a"); // Do a search to validate this is a valid search index

    return searchClient;
  } catch (error) {
    console.error(error);

    return undefined;
  }
};

const getCachedSearchIndex = () => {
  // The search index is stored in local storage which is only available on the client
  if (!import.meta.client) {
    return undefined;
  }

  const storedSearchIndexJson = localStorage.getItem("search-index");
  if (!storedSearchIndexJson) {
    return undefined;
  }

  return createSearchIndex(storedSearchIndexJson);
};

const cacheSearchIndex = (searchIndex: MiniSearch<SearchIndexSearchFields>) => {
  // The search index is stored in local storage which is only available on the client
  if (!import.meta.client) {
    return;
  }

  localStorage.setItem("search-index", JSON.stringify(searchIndex));
};
