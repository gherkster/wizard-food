import type { ServerRecipe } from "common/types/serverRecipe";
import MiniSearch from "minisearch";
import { searchIndexSettings } from "~/types/searchIndex";

import currentHashes from "@/assets/hash.json";

// Store these outside the function in the global scope for re-use
const miniSearch = ref<MiniSearch<ServerRecipe>>();
let indexDownload: Promise<void> | null = null;

export function useSearch() {
  // TODO: Generate this value automatically
  const currentSearchIndexHash = currentHashes.search;

  async function ensureIndex() {
    if (miniSearch.value) {
      return;
    }

    verifySearchIndexIsCached();

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
    // Load lazily so that downloading the search index does not block page loads.
    indexDownload = useFetch<JSON>("/search-index.json").then(({ data: data }) => {
      console.log("loaded latest index from server", data.value);
      if (data.value) {
        const indexString = JSON.stringify(data.value);
        miniSearch.value = MiniSearch.loadJSON(indexString, searchIndexSettings);
        if (process.client) {
          console.log("storing index in localstorage");
          localStorage.setItem("search-index", indexString);
          localStorage.setItem("search-index-hash", currentSearchIndexHash);
        }
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
    });
  }

  return {
    ensureIndex,
    search,
  };
}
