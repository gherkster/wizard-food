<script setup lang="ts">
import type { Image } from "@wizard/content";
import { css } from "styled-system/css";
import { grid } from "styled-system/patterns";

import { useSearch } from "~/composables/useSearch";
import { throwIfNil } from "~/utils/error";
import { describeSearchResults } from "~/utils/format";
import type { RecipeSearchIndexEntry } from "~/utils/search";

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

const { activeFilters, activeQuery, results } = useSearch();

const toCardImage = (recipe: RecipeSearchIndexEntry): Image => {
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

const searchDescription = computed(() =>
  describeSearchResults(activeQuery.value, activeFilters.value, {
    resultCount: results.value.length,
  }),
);

/** Generates a unique key based on the current search state for triggering transitions. */
const searchStateKey = computed(() => {
  if (results.value.length === 0) {
    return "no-results";
  }

  // Create a unique key based on the slugs and their specific order.
  return results.value.map((r) => r.slug).join(",");
});

const containerStyles = css({
  display: "flex",
  flexDirection: "column",
  gap: "md",

  md: {
    flexDirection: "row",
  },
});

const resultsStyles = css({
  display: "flex",
  flexDirection: "column",
  gap: "sm",
});
</script>

<template>
  <div :class="containerStyles">
    <ClientOnly>
      <SearchFilters />

      <div :class="resultsStyles">
        <Text size="xl">{{ searchDescription ?? "All recipes" }}</Text>

        <Transition name="quick-fade" mode="out-in">
          <div
            :key="searchStateKey"
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
            <RecipeCard
              v-for="(recipe, index) in results"
              :key="recipe.slug"
              :title="recipe.title"
              :image="toCardImage(recipe)"
              :to="`/recipes/${recipe.slug}`"
              :tag="recipe.featuredTag"
              :duration="recipe.durationTotal"
              :lazy-load-image="index > 8"
            />
          </div>
        </Transition>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.quick-fade-enter-active,
.quick-fade-leave-active {
  transition: opacity 0.15s ease;
}
.quick-fade-enter-from,
.quick-fade-leave-to {
  opacity: 0;
}
</style>
