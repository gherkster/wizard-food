<template>
  <div class="recipe-preview">
    <blurrable-image v-if="recipe.coverImage" :img="recipe.coverImage" />
    <nuxt-link :to="`/recipes/${props.recipe.slug}`">{{ props.recipe.title }}</nuxt-link>
  </div>
</template>

<script setup lang="ts">
import type { RecipePreview } from "~/types/recipe";

// TODO: Should only be a subset of the ServerRecipe, probably mapped as well
const props = defineProps<{
  recipe: RecipePreview;
}>();
</script>

<style lang="scss" scoped>
.recipe-preview {
  max-width: 16rem;
}
</style>
