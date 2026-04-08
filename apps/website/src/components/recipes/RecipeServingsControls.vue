<template>
  <div class="recipe__options">
    <servings-adjuster
      :servings="servings"
      :singular-label="recipe.servingsType?.singular"
      :plural-label="recipe.servingsType?.plural"
      class="recipe__multiplier"
      @input="setServings"
    />
  </div>
</template>

<script setup lang="ts">
import type { RecipePayload } from "@wizard/content/store";

import ServingsAdjuster from "@/components/ServingsAdjuster.vue";
import { useRecipeServingsState } from "@/composables/useRecipeServingsState";

const props = defineProps<{
  recipe: RecipePayload;
  recipeKey: string;
}>();

const initialServings = props.recipe.servings && props.recipe.servings > 0 ? props.recipe.servings : 1;
const { servings, setServings } = useRecipeServingsState(props.recipeKey, initialServings);
</script>

<style lang="scss" scoped>
.recipe__options {
  display: flex;
  justify-content: space-between;
  align-items: end;
}
</style>
