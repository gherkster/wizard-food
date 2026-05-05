<script setup lang="ts">
import type { InlineIngredientHTMLElement } from "@wizard/content";
import { formatIngredient, type InlineIngredient, type SingularPluralPair } from "@wizard/content";
import Fraction from "fraction.js";
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

type InlineIngredientMarkup = {
  element: {
    textContent: string | null;
  };
  data: {
    amount?: Fraction;
    unit?: SingularPluralPair;
    name: SingularPluralPair;
  };
};

const props = defineProps<{
  content: string;
  selectedServings: number;
  originalServings: number;
}>();

const inlineIngredientsRef = ref<HTMLDivElement>();

const inlineIngredients = ref<InlineIngredientMarkup[]>([]);

onMounted(() => {
  const elements =
    inlineIngredientsRef.value?.querySelectorAll<InlineIngredientHTMLElement>(".inline-ingredient");

  elements?.forEach((elem) => {
    const ingredient = tryParseInlineIngredient(elem);
    if (!ingredient) {
      return;
    }

    inlineIngredients.value.push({
      element: elem,
      data: {
        amount: ingredient.amount ? new Fraction(ingredient.amount) : undefined,
        unit: ingredient.unit,
        name: ingredient.name,
      },
    });
  });
});

watch(
  () => props.selectedServings,
  (newMultiplier) => multiplyInlineIngredients(newMultiplier),
);

const multiplyInlineIngredients = (multiplicationFactor: number) => {
  inlineIngredients.value.forEach((ingredient) => {
    if (!ingredient.data.amount) {
      return;
    }

    const currentAmount = ingredient.data.amount
      .mul(multiplicationFactor)
      .div(props.originalServings);

    const displayedIngredient = formatIngredient({
      amount: currentAmount,
      name:
        currentAmount.valueOf() <= 1 ? ingredient.data.name.singular : ingredient.data.name.plural,
      unit: getUnitLabel(ingredient.data.unit, currentAmount.valueOf()),
      note: "",
    });
    ingredient.element.textContent = displayedIngredient;
  });
};

const getUnitLabel = (unit: SingularPluralPair | undefined, currentAmount: number) => {
  if (!unit) {
    return undefined;
  }

  // We can't switch between a singular and plural form if there's no number to use as a threshold
  if (!currentAmount) {
    return undefined;
  }

  return currentAmount <= 1 ? unit.singular : unit.plural;
};

const tryParseInlineIngredient = (
  element: InlineIngredientHTMLElement,
): InlineIngredient | undefined => {
  try {
    // Inline ingredients are rendered by the tiptap extension as a JSON string in the ingredient data attribute
    return JSON.parse(element.dataset.ingredient) as InlineIngredient;
  } catch (error) {
    console.error(error);
    console.info({
      content: element.textContent,
      dataset: element.dataset.ingredient,
    });
    return undefined;
  }
};
</script>

<template>
  <div
    ref="inlineIngredientsRef"
    :class="
      css({
        flex: 1,
        flexDirection: 'column',
        '& .inline-ingredient': { fontWeight: token('fontWeights.bold') },
      })
    "
    v-html="content"
  />
</template>
