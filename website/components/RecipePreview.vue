<template>
  <nuxt-link :to="`/recipes/${props.recipe.slug}`">
    <div class="recipe-preview">
      <blurrable-image v-if="recipe.coverImage" :img="recipe.coverImage" purpose="preview" />
      <div class="recipe-preview__content">
        <p class="recipe-preview__tag text-grey">{{ props.recipe.category }} | {{ props.recipe.cuisine }}</p>
        <span>{{ props.recipe.title }}</span>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
import type { RecipePreview } from "~/types/recipe";

const props = defineProps<{
  recipe: RecipePreview;
}>();

// TODO: Display total duration?
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;
.recipe-preview {
  max-width: 200px;
  border: v.$border-outline;
  background-color: white;
  &__content {
    @include m.spacing("p", "xs");
    .text-grey {
      display: inline-block;
    }
  }
  &__tag {
    margin-top: 0;
  }
}
</style>
