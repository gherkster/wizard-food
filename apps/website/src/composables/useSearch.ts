import { ref } from "vue";
import MiniSearch, { type SearchResult } from "minisearch";

import {
  searchIndexSettings,
  type SearchIndexRecipe,
  type SearchIndexSearchFields,
} from "@/utils/search";

// Store these outside the function in the global scope for re-use
const miniSearch = ref<MiniSearch<SearchIndexSearchFields>>();

export type RecipeSearchResult = SearchResult & SearchIndexRecipe;

export function useSearch() {
  async function ensureIndex() {
    if (miniSearch.value) {
      return;
    }

    verifySearchIndexIsCached();

    // If a valid copy of the search index wasn't found in localstorage,
    // Trigger an async download of the index in the background
    if (!miniSearch.value) {
      await refreshIndex();
    }
  }

  function verifySearchIndexIsCached() {
    if (typeof window === "undefined") {
      return;
    }

    const storedIndex = localStorage.getItem("search-index");
    if (storedIndex) {
      loadIndex(storedIndex);
    }
  }

  async function refreshIndex() {
    if (typeof window === "undefined") {
      return;
    }

    const response = await fetch("/search-index.json");
    if (!response.ok) {
      return;
    }

    const index = (await response.json()) as JSON;
    const jsonString = JSON.stringify(index);
    loadIndex(jsonString);

    localStorage.setItem("search-index", jsonString);
  }

  async function search(query: string) {
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
  }

  async function allItems() {
    if (!miniSearch.value) {
      await ensureIndex();
    }

    if (!miniSearch.value) {
      return [];
    }

    return miniSearch.value.search(MiniSearch.wildcard) as RecipeSearchResult[];
  }

  function loadIndex(jsonString: string) {
    try {
      miniSearch.value = MiniSearch.loadJSON(jsonString, searchIndexSettings);
      miniSearch.value.search("a"); // Do a search to validate this is a valid search index
    } catch (error) {
      miniSearch.value = undefined;
      console.error(error);
    }
  }

  return {
    allItems,
    ensureIndex,
    refreshIndex,
    search,
  };
}
