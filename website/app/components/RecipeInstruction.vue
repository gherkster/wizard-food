<template>
  <div ref="inlineIngredientsRef" class="instruction" v-html="content" />
</template>

<script setup lang="ts">
import Fraction from "fraction.js";
import type {
  InlineIngredient,
  InlineIngredientHTMLElement,
  SingularPluralPair,
} from "~~/shared/types/recipe";

type InlineIngredientMarkup = {
  element: HTMLElement;
  data: {
    amount?: Fraction;
    unit?: SingularPluralPair;
    name: SingularPluralPair;
  };
};

const props = defineProps<{
  content: string;
  ingredientMultiplier: number;
  originalNumberOfServings: number;
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
  () => props.ingredientMultiplier,
  (newMultiplier) => multiplyInlineIngredients(newMultiplier),
);

const multiplyInlineIngredients = (multiplicationFactor: number) => {
  inlineIngredients.value.forEach((ingredient) => {
    if (!ingredient.data.amount) {
      return;
    }

    const currentAmount = ingredient.data.amount
      .mul(multiplicationFactor)
      .div(props.originalNumberOfServings);

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
  }
};
</script>

<style lang="scss" scoped>
.instruction {
  flex: 1;
  flex-direction: column;
}
</style>

<style lang="scss">
@use "@/styles/variables" as v;
.inline-ingredient {
  font-weight: v.$font-weight-bold;
}
</style>
