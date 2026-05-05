<script setup lang="ts">
import type { Image } from "@wizard/content";
import { center, grid } from "styled-system/patterns";

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
  return {
    height: recipe.image.height,
    modifiedOn: "",
    sizes: recipe.image.sizes,
    src: recipe.image.src,
    srcSet: recipe.image.srcSet,
    title: `Picture of ${recipe.title}`,
    width: recipe.image.width,
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
  <div
    v-if="isEmptySearchResult"
    :class="
      center({
        display: 'flex',
        flexDirection: 'column',
        w: '100%',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      })
    "
  >
    <h3>
      No recipes found for <b>{{ searchTerm }}</b>
    </h3>

    <HoverLink to="/recipes">
      <Text size="xl">See all recipes</Text>
    </HoverLink>
  </div>
  <div v-else>
    <h2>
      {{ searchResultsPrefix }}<b v-show="searchTerm">{{ searchTerm }}</b>
    </h2>
    <div
      :class="
        grid({
          columns: {
            base: 2,
            md: 3,
            lg: 4,
          },
          columnGap: 'sm',
          rowGap: 'md',
        })
      "
    >
      <ClientOnly>
        <RecipeCard
          v-for="(recipe, index) in recipes"
          :key="recipe.slug"
          :title="recipe.title"
          :image="toCardImage(recipe)"
          :to="`/recipes/${recipe.slug}`"
          :tag="recipe.featuredTag"
          :duration="recipe.totalDuration"
          :lazy-load-image="index > 8"
        />
      </ClientOnly>
    </div>
  </div>
</template>
