<template>
  <div class="content">
    <h1>Recipes</h1>
    <div>
      <recipe-preview v-for="recipe in recipes" :key="recipe.slug" :recipe="recipe" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServerRecipe } from "common/types/serverRecipe";

const recipesResponse = await useAsyncData(async () => {
  // TODO: Mapping? Also need to minimise the number of returned fields
  const { data: recipes } = await useFetch<ServerRecipe[]>("/api/recipes");
  return recipes.value;
});

if (recipesResponse.error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: recipesResponse.error.value?.message,
  });
}

if (!recipesResponse.data.value || recipesResponse.data.value.length === 0) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found!",
  });
}

const recipes = ref(recipesResponse.data.value!);
</script>
