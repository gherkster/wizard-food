import { ref } from "vue";

const query = ref("");
let popstateBound = false;

const readQueryFromUrl = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const search = new URLSearchParams(window.location.search).get("search");
  return search?.toString() ?? "";
};

const syncFromUrl = () => {
  query.value = readQueryFromUrl();
};

export function useRecipeSearchState() {
  const initFromUrl = () => {
    if (typeof window === "undefined") {
      return;
    }

    syncFromUrl();

    if (!popstateBound) {
      window.addEventListener("popstate", syncFromUrl);
      popstateBound = true;
    }
  };

  const setQuery = (nextQuery: string, options?: { replaceUrl?: boolean }) => {
    query.value = nextQuery;

    if (typeof window === "undefined") {
      return;
    }

    if (!options?.replaceUrl) {
      return;
    }

    const trimmedQuery = nextQuery.trim();
    const url =
      trimmedQuery.length === 0
        ? "/recipes"
        : `/recipes?search=${encodeURIComponent(trimmedQuery)}`;
    window.history.replaceState({}, "", url);
  };

  return {
    query,
    initFromUrl,
    setQuery,
  };
}
