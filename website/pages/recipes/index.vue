<template>
  <div v-if="isEmptySearchResult" id="no-results-message">
    <h3>
      No recipes found for <b>{{ searchTerm }}</b>
    </h3>
    <v-button size="large" @click="showAllRecipes">See all recipes</v-button>
  </div>
  <div v-else>
    <h2>
      {{ title }}<b v-show="searchTerm">{{ searchTerm }}</b>
    </h2>
    <div class="recipes">
      <client-only>
        <template v-for="index in 23">
          <v-card
            v-for="recipe in recipes"
            :key="recipe.slug"
            :title="recipe.title"
            :image="recipe.coverImage"
            :link="`/recipes/${recipe.slug}`"
            :tag="recipe.featuredTag"
            :duration="recipe.totalDuration"
            :lazy-load-image="index > 8"
          />
        </template>
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecipePreview } from "~/types/recipe";

const route = useRoute();
const searchTerm = computed(() => {
  if (!route.query.search || typeof route.query.search !== "string") {
    return null;
  }

  return route.query.search.trim();
});

const searchClient = useSearch();

const recipes = ref<RecipePreview[]>([]);

watch(
  () => route.query,
  async () => {
    if (!route.query.search || typeof route.query.search !== "string") {
      recipes.value = await searchClient.allItems();
      console.log("Showing all recipes", recipes.value);
      return;
    }

    // TODO Set minimum number of characters to do search
    // TODO: Need to use a loader if search index is still downloading
    const searchResults = await searchClient.search(route.query.search);
    recipes.value = searchResults;
  },
  {
    // Need immediate so it also runs on fresh page load
    immediate: true,
  },
);

// TODO: Don't show this if the index is still downloading
const isEmptySearchResult = computed(() => recipes.value.length === 0 && searchTerm.value);

const title = computed(() => {
  if (isEmptySearchResult.value) {
    return "No recipes found for ";
  }

  if (searchTerm.value) {
    return "Search Results for ";
  }

  return "Recipes";
});

async function showAllRecipes() {
  await navigateTo("/recipes");
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

#no-results-message {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
