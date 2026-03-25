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
import { onMounted, onUnmounted, ref } from "vue";
import { navigate } from "astro:transitions/client";
import VSearch from "@/components/VSearch.vue";
import VMascot from "@/components/VMascot.vue";
import { debounce } from "@/utils/debounce";
import { useSearch } from "@/composables/useSearch";
import { useRecipeSearchState } from "@/composables/useRecipeSearchState";

const searchClient = useSearch();
searchClient.ensureIndex();

const { query, initFromUrl, setQuery } = useRecipeSearchState();
const isNavigatingToRecipes = ref(false);
let syncFromLocationHandler: (() => void) | null = null;

const onInput = (value: string) => {
  const isRecipesPage = window.location.pathname === "/recipes";

  if (!isRecipesPage) {
    setQuery(value);
    const trimmedQuery = value.trim();
    if (trimmedQuery.length === 0) {
      return;
    }

    if (!isNavigatingToRecipes.value) {
      isNavigatingToRecipes.value = true;
      void navigate(`/recipes?search=${encodeURIComponent(trimmedQuery)}`);
    }
    animateMascot();
    return;
  }

  search(value);
  animateMascot();
};

const searchDebounceMs = 150;

const search = debounce(async (value: string) => {
  setQuery(value);
  const trimmedQuery = value.trim();
  const isRecipesPage = window.location.pathname === "/recipes";

  if (isRecipesPage) {
    isNavigatingToRecipes.value = false;
    setQuery(value, { replaceUrl: true });
    return;
  }

  if (trimmedQuery.length === 0) {
    void navigate("/recipes");
    return;
  }

  void navigate(`/recipes?search=${encodeURIComponent(trimmedQuery)}`);
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
  const syncFromLocation = () => {
    if (window.location.pathname === "/recipes") {
      initFromUrl();
      isNavigatingToRecipes.value = false;
      return;
    }

    setQuery("");
    isNavigatingToRecipes.value = false;
  };

  syncFromLocationHandler = syncFromLocation;
  syncFromLocation();
  document.addEventListener("astro:after-swap", syncFromLocation);
  window.addEventListener("popstate", syncFromLocation);
});

onUnmounted(() => {
  if (!syncFromLocationHandler) {
    return;
  }

  document.removeEventListener("astro:after-swap", syncFromLocationHandler);
  window.removeEventListener("popstate", syncFromLocationHandler);
});
</script>
