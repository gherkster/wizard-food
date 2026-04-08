<template>
  <div v-for="ingredientSection in recipe.ingredientGroups" :key="`${ingredientSection.name}-${ingredientSection.ingredients.length}`">
    <p v-if="ingredientSection.name">
      <b>{{ ingredientSection.name }}</b>
    </p>
    <ul>
      <template v-for="ingredient in ingredientSection.ingredients" :key="ingredient.name.singular">
        <li v-if="!ingredient.inlineOnly">
          <recipe-ingredient
            :ingredient="ingredient"
            :ingredient-multiplier="servings"
            :original-number-of-servings="originalServings"
          />
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { RecipePayload } from "@wizard/content/store";

import RecipeIngredient from "@/components/RecipeIngredient.vue";
import { useRecipeServingsState } from "@/composables/useRecipeServingsState";

const props = defineProps<{
  recipe: RecipePayload;
  recipeKey: string;
}>();

const initialServings = props.recipe.servings && props.recipe.servings > 0 ? props.recipe.servings : 1;
const { servings, originalServings } = useRecipeServingsState(props.recipeKey, initialServings);
</script>
