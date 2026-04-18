<script setup lang="ts">
import type { Image } from "@wizard/content";

import { useSearch } from "~/composables/useSearch";
import { throwIfNil } from "~/utils/error";
import type { SearchIndexRecipe } from "~/utils/search";

const { data: content } = await useFetch("/api/content/recipes");
throwIfNil(content.value, "Failed to fetch content.");

useHead({
  title: content.value.title,
});

if (import.meta.server) {
  useSeoMeta({
    title: content.value.title,
    ogTitle: content.value.title,
    description: content.value.description,
    ogDescription: content.value.openGraphDescription,
  });
}

const route = useRoute();
const searchTerm = computed(() => {
  if (!route.query.search || typeof route.query.search !== "string") {
    return null;
  }

  return route.query.search.trim();
});

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

watch(
  () => route.query,
  async () => {
    if (!route.query.search || typeof route.query.search !== "string") {
      recipes.value = await searchClient.allItems();
      return;
    }

    const searchResults = await searchClient.search(route.query.search);
    recipes.value = searchResults;
  },
  {
    // Need immediate so it also runs on fresh page load
    immediate: true,
  },
);

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
</script>

<template>
  <div v-if="isEmptySearchResult" class="center-screen">
    <h3>
      No recipes found for <b>{{ searchTerm }}</b>
    </h3>
    <v-button size="large" @click="navigateTo('/recipes')">See all recipes</v-button>
  </div>
  <div v-else>
    <h2>
      {{ searchResultsPrefix }}<b v-show="searchTerm">{{ searchTerm }}</b>
    </h2>
    <div class="recipes">
      <client-only>
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
      </client-only>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;

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
