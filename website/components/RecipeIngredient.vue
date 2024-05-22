<template>
  <span>
    <span v-if="formattedAmount">{{ formattedAmount }}&nbsp;</span>
    <span v-if="unitVariant">{{ unitVariant }}&nbsp;</span>
    <span class="recipe__ingredient__name" v-html="nameVariant" />
    <span v-if="ingredient.note" class="text-muted"
      ><i>&nbsp;{{ ingredient.note }}</i></span
    >
  </span>
</template>

<script setup lang="ts">
import Fraction from "fraction.js";
import type { IngredientUnitForm } from "~/types/mapping";
import type { Ingredient } from "~/types/recipe";

const props = defineProps<{
  ingredient: Ingredient;
  ingredientMultiplier: number;
  originalNumberOfServings: number;
  unitForms: IngredientUnitForm[];
}>();

const amount = computed(() => (props.ingredient.amount ? new Fraction(props.ingredient.amount) : undefined));

const multipliedAmount = computed(() => {
  if (!amount.value) {
    return undefined;
  }

  return amount.value.mul(props.ingredientMultiplier).div(props.originalNumberOfServings);
});

const formatter = useRecipeFormatter();

const formattedAmount = computed(() => {
  if (!multipliedAmount.value) {
    return "";
  }

  return formatter.formatIngredientAmount(multipliedAmount.value);
});

const unitVariant = computed(() => {
  if (!props.ingredient.unit) {
    return "";
  }
  // We can't switch between a singular and plural form if there's no number to use as a threshold
  if (!multipliedAmount.value) {
    return props.ingredient.unit ?? "";
  }

  const multipleFormsUnit = props.unitForms.find(
    (m) => m.singularForm === props.ingredient.unit || m.pluralForm === props.ingredient.unit,
  );
  if (!multipleFormsUnit) {
    return props.ingredient.unit;
  }

  return multipliedAmount.value.valueOf() <= 1 ? multipleFormsUnit.singularForm : multipleFormsUnit.pluralForm;
});

const nameVariant = computed(() => {
  if (!multipliedAmount.value) {
    // Both singular and plural should be the same in a situation where amount isn't provided,
    // but plural is more likely to be correct if they were actually different
    return props.ingredient.name.plural;
  }

  return multipliedAmount.value.valueOf() <= 1 ? props.ingredient.name.singular : props.ingredient.name.plural;
});
</script>
