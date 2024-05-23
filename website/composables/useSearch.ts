import type { ServerRecipe } from "common/types/serverRecipe";
import MiniSearch, { type SearchResult } from "minisearch";
import { searchIndexSettings, type SearchIndexStoredFields } from "~/types/searchIndex";

// Store these outside the function in the global scope for re-use
const miniSearch = ref<MiniSearch<ServerRecipe>>();

export interface RecipeSearchResult extends SearchResult, SearchIndexStoredFields {}

export function useSearch() {
  async function ensureIndex() {
    if (miniSearch.value) {
      return;
    }

    verifySearchIndexIsCached();

    // If a valid copy of the search index wasn't found in localstorage,
    // trigger an async download of the index in the background
    if (!miniSearch.value) {
      await refreshIndex();
    }
  }

  function verifySearchIndexIsCached() {
    if (process.client) {
      const storedIndex = localStorage.getItem("search-index");
      if (storedIndex) {
        try {
          miniSearch.value = MiniSearch.loadJSON(storedIndex, searchIndexSettings);
          miniSearch.value.search("a"); // Do a search to validate this is a valid search index
        } catch (error) {
          miniSearch.value = undefined;
          console.error(error);
        }
      }
    }
  }

  async function refreshIndex() {
    if (!process.client) {
      return;
    }

    const { data: index } = await useFetch<JSON>("/search-index.json");
    if (index.value) {
      const jsonString = JSON.stringify(index.value);
      miniSearch.value = MiniSearch.loadJSON(jsonString, searchIndexSettings);

      localStorage.setItem("search-index", jsonString);
    }
  }

  async function search(query: string) {
    if (!miniSearch.value) {
      await refreshIndex();
    }

    if (!miniSearch.value) {
      return [];
    }

    return miniSearch.value.search(query, {
      prefix: true, // Match on the prefix of the result, not exact word matches. I.e. chick -> chicken
    }) as RecipeSearchResult[];
  }

  async function allItems() {
    if (!miniSearch.value) {
      await refreshIndex();
    }

    if (!miniSearch.value) {
      return [];
    }

    return miniSearch.value.search(MiniSearch.wildcard) as RecipeSearchResult[];
  }

  return {
    ensureIndex,
    refreshIndex,
    search,
    allItems,
  };
}
