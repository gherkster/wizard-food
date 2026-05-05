<script setup lang="ts">
import type { IngredientGroup } from "@wizard/content";
import { css } from "styled-system/css";

interface Props {
  ingredientGroups: IngredientGroup[];
  selectedServings: number;
  originalServings: number;
}

defineProps<Props>();
</script>

<template>
  <div>
    <h2>Ingredients</h2>

    <div :class="css({ display: 'flex', flexDirection: 'column', rowGap: '1.2em' })">
      <div
        v-for="ingredientSection in ingredientGroups"
        :key="`${ingredientSection.name}-${ingredientSection.ingredients.length}`"
      >
        <Text
          v-if="ingredientSection.name"
          size="lg"
          weight="bold"
          is="div"
          :class="css({ mb: '0.5em' })"
        >
          {{ ingredientSection.name }}
        </Text>

        <ul :class="css({ listStyle: 'inside' })">
          <template v-for="ingredient in ingredientSection.ingredients">
            <li v-if="!ingredient.inlineOnly" :key="ingredient.name.singular">
              <RecipeIngredient
                :ingredient="ingredient"
                :selected-servings="selectedServings"
                :original-servings="originalServings"
              />
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>
