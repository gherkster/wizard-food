<template>
  <div class="content">
    <h2>{{ dynamicTitle }}</h2>
    <div class="recipes">
      <client-only>
        <template v-for="index in 23">
          <recipe-preview v-for="recipe in filteredRecipes" :key="recipe.slug" :recipe="recipe" />
        </template>
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecipeListResponse } from "~/types/recipe";

const recipesResponse = await useAsyncData(async () => {
  const { data: recipes } = await useFetch<RecipeListResponse>("/api/recipes");
  return recipes.value;
});

if (recipesResponse.error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: recipesResponse.error.value?.message,
  });
}

if (!recipesResponse.data.value || recipesResponse.data.value.recipes.length === 0) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found!",
  });
}

const recipes = ref(recipesResponse.data.value!.recipes);

console.log("recipes from server: ", recipes.value.length);

const route = useRoute();
const searchTerm = computed(() => {
  if (!route.query.search || typeof route.query.search !== "string") {
    return null;
  }

  return route.query.search;
});

const dynamicTitle = computed(() => (searchTerm.value ? `Search Results - ${searchTerm.value}` : "Recipes"));

const searchClient = useSearch();

const filteredRecipes = computed(() => {
  if (!searchTerm.value) {
    return recipes.value;
  }

  const searchSet = new Set(filteredRecipeIds.value);
  return recipes.value.filter((r) => searchSet.has(r.slug));
});

const filteredRecipeIds = ref<string[]>([]);

watch(
  () => route.query,
  async () => {
    if (!route.query.search || typeof route.query.search !== "string") {
      return;
    }

    // TODO Set minimum number of characters to do search
    // TODO: Need to use a loader if search index is still downloading
    const searchResults = await searchClient.search(route.query.search);
    filteredRecipeIds.value = searchResults.map((r) => r.id as string);

    console.log("watch route, searching for ", route.query.search, " results: ", searchResults);
  },
  {
    // Need immediate so it also runs on fresh page load
    immediate: true,
  },
);
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

.filter {
  background-color: v.$colour-primary;
  @include m.spacing("p", "xs");
  display: flex;
  flex-direction: column;
  &__section {
    display: flex;
    flex-direction: column;
  }
}
</style>
