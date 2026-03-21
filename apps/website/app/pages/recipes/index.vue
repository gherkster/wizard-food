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
          :image="{
            ...recipe.coverImage,
            title: `Picture of ${recipe.title}`,
          }"
          :link="`/recipes/${recipe.slug}`"
          :tag="recipe.featuredTag"
          :duration="recipe.totalDurationLabel"
          :lazy-load-image="index > 8"
        />
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const searchTerm = computed(() => {
  if (!route.query.search || typeof route.query.search !== "string") {
    return null;
  }

  return route.query.search.trim();
});

const searchClient = useSearch();

const recipes = ref<SearchIndexRecipe[]>([]);

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

const contentResponse = await useAsyncData(async () => {
  const { data: response } = await useFetch("/api/content/recipes");
  return response.value;
});

if (contentResponse.error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: contentResponse.error.value.message,
  });
}

if (!contentResponse.data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Content not found!",
  });
}

const content = contentResponse.data.value;

useHead({
  title: content.title,
});

if (import.meta.server) {
  useSeoMeta({
    title: content.title,
    ogTitle: content.title,
    description: content.description,
    ogDescription: content.openGraphDescription,
  });
}
</script>

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
