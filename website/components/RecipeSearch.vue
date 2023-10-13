<template>
  <input placeholder="Search" class="nav-header__search" @input="testSearch" />
</template>

<script setup lang="ts">
import MiniSearch from "minisearch";
import { ServerRecipe } from "~/types/serverRecipe";
import { searchIndexSettings } from "~/types/searchIndex";

const loadIndex = import("@/assets/search-index.json");
const miniSearch = ref<MiniSearch<ServerRecipe> | null>(null);

// Load lazily so that downloading the search index does not block page loads.
loadIndex.then((index) => {
  if (index?.serializationVersion) {
    miniSearch.value = MiniSearch.loadJS(index, searchIndexSettings);
  }
});

function testSearch(event) {
  const value = event.target.value;
  if (!miniSearch.value) {
    return [];
  }
  console.log(miniSearch.value?.autoSuggest(value));
}
</script>

<style scoped lang="scss"></style>
