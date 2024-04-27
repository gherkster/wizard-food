import type { ServerRecipe } from "common/types/serverRecipe";
import MiniSearch, { type SearchResult } from "minisearch";
import { searchIndexSettings, type SearchIndexStoredFields } from "~/types/searchIndex";

import currentHashes from "@/assets/hash.json";

// Store these outside the function in the global scope for re-use
const miniSearch = ref<MiniSearch<ServerRecipe>>();
let indexDownload: Promise<void> | null = null;

export interface RecipeSearchResult extends SearchResult, SearchIndexStoredFields {}

export function useSearch() {
  // TODO: Generate this value automatically
  const currentSearchIndexHash = currentHashes.search;

  async function ensureIndex() {
    if (miniSearch.value) {
      return;
    }

    // TODO: May want to remove this check eventually
    if (!import.meta.dev) {
      verifySearchIndexIsCached();
    }

    // If a valid copy of the search index wasn't found in localstorage,
    // trigger an async download of the index in the background
    if (!miniSearch.value) {
      downloadIndex();
    }
  }

  function verifySearchIndexIsCached() {
    if (process.client) {
      const storedSearchIndexHash = localStorage.getItem("search-index-hash");

      if (currentSearchIndexHash && currentSearchIndexHash === storedSearchIndexHash) {
        const storedIndex = localStorage.getItem("search-index");
        if (storedIndex) {
          try {
            miniSearch.value = MiniSearch.loadJSON(storedIndex, searchIndexSettings);
            miniSearch.value.search("a"); // Do a search to validate this is a valid search index
            console.log("Got index from localstorage");
          } catch (error) {
            miniSearch.value = undefined;
            console.error(error);
          }
        }
      }
    }
  }

  async function downloadIndex() {
    if (!process.client) {
      return;
    }

    // Load lazily so that downloading the search index does not block page loads.
    indexDownload = $fetch("/api/search-index").then((index) => {
      if (index) {
        miniSearch.value = MiniSearch.loadJSON(index, searchIndexSettings);

        console.log("storing index in localstorage");
        localStorage.setItem("search-index", index);
        localStorage.setItem("search-index-hash", currentSearchIndexHash);
      }
    });
  }

  async function search(query: string) {
    if (indexDownload) {
      await indexDownload;
    }

    console.log("searching, is search loaded: ", !!miniSearch.value);

    if (!miniSearch.value) {
      return [];
    }

    return miniSearch.value.search(query, {
      prefix: true, // Match on the prefix of the result, not exact word matches. I.e. chick -> chicken
    }) as RecipeSearchResult[];
  }

  async function allItems() {
    if (indexDownload) {
      await indexDownload;
    }

    if (!miniSearch.value) {
      return [];
    }

    return miniSearch.value.search(MiniSearch.wildcard) as RecipeSearchResult[];
  }

  return {
    ensureIndex,
    search,
    allItems,
  };
}
