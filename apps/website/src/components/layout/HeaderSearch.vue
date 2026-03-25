<template>
  <div class="nav-header-search">
    <v-mascot
      :excited="isAnimated"
      :size="54"
      class="nav-header-search__mascot"
      @click="animateMascot"
    />
    <v-search
      :value="query"
      class="nav-header-search__input"
      @input="onInput"
      @search="onInput"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import VSearch from "@/components/VSearch.vue";
import VMascot from "@/components/VMascot.vue";
import { debounce } from "@/utils/debounce";
import { useSearch } from "@/composables/useSearch";
import { useRecipeSearchState } from "@/composables/useRecipeSearchState";

const searchClient = useSearch();
searchClient.ensureIndex();

const { query, initFromUrl, setQuery } = useRecipeSearchState();

const onInput = (value: string) => {
  search(value);
  animateMascot();
};

const searchDebounceMs = 150;

const search = debounce(async (value: string) => {
  setQuery(value);
  const trimmedQuery = value.trim();
  const isRecipesPage = window.location.pathname === "/recipes";

  if (isRecipesPage) {
    setQuery(value, { replaceUrl: true });
    return;
  }

  if (trimmedQuery.length === 0) {
    window.location.assign("/recipes");
    return;
  }

  window.location.assign(`/recipes?search=${encodeURIComponent(trimmedQuery)}`);
}, searchDebounceMs);

const isAnimated = ref(false);

const animateMascot = () => {
  isAnimated.value = true;
  finishAnimating();
};

const animationDebounceMs = 1000;

const finishAnimating = debounce(() => {
  isAnimated.value = false;
}, animationDebounceMs);

onMounted(() => {
  initFromUrl();
});
</script>
