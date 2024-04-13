<template>
  <div>
    <input placeholder="Search" @input="search" />
    <div>
      <span v-for="result in searchResults" :key="result">{{ result }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import MiniSearch from "minisearch";
import type { ServerRecipe } from "common/types/serverRecipe";
import { searchIndexSettings } from "~/types/searchIndex";

const loadIndex = import("@/assets/search-index.json");
const miniSearch = ref<MiniSearch<ServerRecipe> | null>(null);

// Load lazily so that downloading the search index does not block page loads.
loadIndex.then((index) => {
  if (index?.serializationVersion) {
    miniSearch.value = MiniSearch.loadJS(index, searchIndexSettings);
  }
});

const searchResults = ref<string[]>([]);

function search(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  // TODO: Check if still loading and spin until finished
  if (!miniSearch.value) {
    return [];
  }

  // TODO Set minimum number of characters to do search
  searchResults.value = miniSearch.value
    ?.search(value, {
      prefix: true, // Match on the prefix of the result, not exact word matches. I.e. chick -> chicken
    })
    .map((r) => r.id);
}
</script>
