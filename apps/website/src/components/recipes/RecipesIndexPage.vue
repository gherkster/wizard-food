<template>
  <div v-if="isEmptySearchResult" class="center-screen">
    <h3>
      No recipes found for <b>{{ searchTerm }}</b>
    </h3>
    <v-button size="large" @click="navigateToRecipes">See all recipes</v-button>
  </div>
  <div v-else>
    <h2>
      {{ searchResultsPrefix }}<b v-show="searchTerm">{{ searchTerm }}</b>
    </h2>
    <div class="recipes">
      <v-card
        v-for="(recipe, index) in recipes"
        :key="recipe.slug"
        :title="recipe.title"
        :image="toCardImage(recipe)"
        :link="`/recipes/${recipe.slug}`"
        :tag="recipe.featuredTag"
        :duration="recipe.totalDurationLabel"
        :lazy-load-image="index > 8"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { Image } from "@wizard/content/store";

import VButton from "@/components/VButton.vue";
import VCard from "@/components/VCard.vue";
import { useRecipeSearchState } from "@/composables/useRecipeSearchState";
import type { SearchIndexRecipe } from "@/utils/search";
import { useSearch } from "@/composables/useSearch";

const { query, initFromUrl } = useRecipeSearchState();

const searchClient = useSearch();

const recipes = ref<SearchIndexRecipe[]>([]);

const toCardImage = (recipe: SearchIndexRecipe): Image => {
  const previewSquare = recipe.coverImage.previewSquare;

  return {
    id: recipe.slug,
    title: `Picture of ${recipe.title}`,
    fileName: recipe.slug,
    width: recipe.coverImage.width,
    height: recipe.coverImage.height,
    modifyDate: "",
    variants: {
      cover: {
        portrait: previewSquare,
        square: previewSquare,
      },
      preview: {
        portrait: previewSquare,
        square: previewSquare,
      },
      instruction: {
        portrait: previewSquare,
        square: previewSquare,
      },
    },
  };
};

const refreshResults = async () => {
  const searchTerm = query.value.trim();
  if (!searchTerm) {
    recipes.value = await searchClient.allItems();
    return;
  }

  const searchResults = await searchClient.search(searchTerm);
  recipes.value = searchResults;
};

onMounted(async () => {
  initFromUrl();
});

watch(
  query,
  async () => {
    await refreshResults();
  },
  { immediate: true },
);

const searchTerm = computed(() => {
  const value = query.value.trim();
  return value.length > 0 ? value : null;
});

const isEmptySearchResult = computed(() => recipes.value.length === 0 && !!searchTerm.value);

const searchResultsPrefix = computed(() => {
  if (isEmptySearchResult.value) {
    return "No recipes found for ";
  }

  if (searchTerm.value) {
    return "Search Results for ";
  }

  return "Recipes";
});

const navigateToRecipes = () => {
  window.location.assign("/recipes");
};
</script>

<style lang="scss" scoped>
@use "../../styles/mixins" as m;

.recipes {
  display: grid;
  @include m.spacing("g", "sm");

  @include m.breakpoint("xs") {
    grid-template-columns: repeat(2, 1fr);
  }
  @include m.breakpoint("sm") {
    grid-template-columns: repeat(3, 1fr);
  }
  @include m.breakpoint("md") {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
