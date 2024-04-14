<template>
  <nuxt-link :to="`/recipes/${props.recipe.slug}`">
    <div class="recipe-preview">
      <blurrable-image v-if="recipe.coverImage" :img="recipe.coverImage" purpose="preview" />
      <div class="recipe-preview__content">
        <p>{{ props.recipe.title }}</p>
        <div class="recipe-preview__stats text-grey">
          <span v-if="props.recipe.featuredTag" class="recipe-preview__tag">
            <small>
              {{ props.recipe.featuredTag }}
            </small>
          </span>
          <span v-if="props.recipe.totalDuration" class="recipe-preview__duration">
            <icon name="mdi:clock-outline" size="18px" />
            <small>{{ props.recipe.totalDuration }}</small>
          </span>
        </div>
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
  position: relative;
  &__content {
    @include m.spacing("py", "xs");
    font-weight: bold;
    > p {
      margin-top: 0;
    }
  }
  &__stats {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
  }
  &__tag {
    display: inline-flex;
    align-items: center;
  }
  &__duration {
    display: inline-flex;
    align-items: center;
    text-transform: uppercase;
    > svg {
      margin-right: 4px;
    }
  }
  small {
    text-wrap: nowrap;
  }
  &:hover {
    top: -1px;
  }
}
</style>
