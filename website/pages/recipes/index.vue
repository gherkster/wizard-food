<template>
  <div class="content">
    <h1>Recipes</h1>
    <div class="recipes">
      <template v-for="index in 23">
        <recipe-preview v-for="recipe in recipes" :key="recipe.slug" :recipe="recipe" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecipePreview } from "~/types/recipe";

const recipesResponse = await useAsyncData(async () => {
  const { data: recipes } = await useFetch<RecipePreview[]>("/api/recipes");
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

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
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
