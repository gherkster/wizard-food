import MiniSearch, { type SearchResult } from "minisearch";

import {
  searchIndexSettings,
  type SearchIndexRecipe,
  type SearchIndexSearchFields,
} from "@/lib/search/search-types";

let miniSearchClient: MiniSearch<SearchIndexSearchFields> | undefined;

/**
 * Searches recipes using a substring query.
 * @param query The substring query to search for.
 * @returns The recipes matching the query.
 */
export const searchRecipes = async (query: string): Promise<RecipeSearchResult[]> => {
  const searchClient = await ensureSearchIndex();

  if (!searchClient) {
    return [];
  }

  return searchClient.search(query, {
    prefix: true,
    combineWith: "AND",
  }) as RecipeSearchResult[];
};

export const ensureSearchIndex = async () => {
  if (miniSearchClient) {
    return miniSearchClient;
  }

  // Check if the search index exists in the client cache
  const cachedIndex = getCachedSearchIndex();
  if (cachedIndex) {
    return cachedIndex;
  }

  // Fetch and parse the search index from the latest json if it isn't cached or couldn't be loaded
  return await fetchSearchIndex();
};

export type RecipeSearchResult = SearchResult & SearchIndexRecipe;

export const allSearchRecipes = async (): Promise<RecipeSearchResult[]> => {
  const searchClient = await ensureSearchIndex();

  if (!searchClient) {
    return [];
  }

  return searchClient.search(MiniSearch.wildcard) as RecipeSearchResult[];
};

const loadIndexFromJson = (searchIndexJson: string) => {
  try {
    miniSearchClient = MiniSearch.loadJSON<SearchIndexSearchFields>(
      searchIndexJson,
      searchIndexSettings,
    );
    miniSearchClient.search("a"); // Run a search to ensure it's valid

    return miniSearchClient;
  } catch (error) {
    console.error(error);
    miniSearchClient = undefined;

    return undefined;
  }
};

export const fetchSearchIndex = async () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const response = await fetch("/search-index.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to download search index: ${response.status}`);
  }

  const indexJson = await response.json();
  const jsonString = JSON.stringify(indexJson);

  window.localStorage.setItem("search-index", jsonString);
  return loadIndexFromJson(jsonString);
};

const getCachedSearchIndex = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  const searchIndexJson = window.localStorage.getItem("search-index");
  if (searchIndexJson) {
    return loadIndexFromJson(searchIndexJson);
  }

  return undefined;
};
