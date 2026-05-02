<script setup lang="ts">
import type { Ingredient } from "@wizard/content";
import Fraction from "fraction.js";
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

import { formatIngredientAmount } from "~/utils/formatting";

const props = defineProps<{
  ingredient: Ingredient;
  ingredientMultiplier: number;
  originalNumberOfServings: number;
}>();

const amount = computed(() =>
  props.ingredient.amount ? new Fraction(props.ingredient.amount) : undefined,
);

const multipliedAmount = computed(() => {
  if (!amount.value) {
    return undefined;
  }

  return amount.value.mul(props.ingredientMultiplier).div(props.originalNumberOfServings);
});

const formattedAmount = computed(() => {
  if (!multipliedAmount.value) {
    return "";
  }

  return formatIngredientAmount(multipliedAmount.value);
});

/** Get the ingredient unit label, displaying the singular or plural form depending on the current recipe multiplier. */
const ingredientUnit = computed(() => {
  if (!props.ingredient.unit) {
    return "";
  }
  // We can't switch between a singular and plural form if there's no number to use as a threshold
  if (!multipliedAmount.value) {
    return props.ingredient.unit ?? "";
  }

  return multipliedAmount.value.valueOf() <= 1
    ? props.ingredient.unit.singular
    : props.ingredient.unit.plural;
});

const nameVariant = computed(() => {
  if (!multipliedAmount.value) {
    // Both singular and plural should be the same in a situation where amount isn't provided,
    // but plural is more likely to be correct if they were actually different
    return props.ingredient.name.plural;
  }

  return multipliedAmount.value.valueOf() <= 1
    ? props.ingredient.name.singular
    : props.ingredient.name.plural;
});
</script>

<template>
  <span>
    <span v-if="formattedAmount">{{ formattedAmount }}&nbsp;</span>
    <span v-if="ingredientUnit">{{ ingredientUnit }}&nbsp;</span>
    <span
      :class="
        css({
          '& p': {
            display: 'inline',
            margin: 0,
          },
        })
      "
      v-html="nameVariant"
    />
    <span v-if="ingredient.note" :class="css({ color: token('colors.font.muted') })"
      ><i>&nbsp;{{ ingredient.note }}</i></span
    >
  </span>
</template>
