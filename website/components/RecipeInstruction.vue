<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div ref="inlineIngredientsRef" class="instruction" v-html="content" />
</template>

<script setup lang="ts">
import Fraction from "fraction.js";
import { useRecipeFormatter } from "~/composables";
import type { IngredientUnitForm } from "~/types/mapping";

interface InlineIngredientMarkup {
  element: HTMLElement;
  data: {
    amount?: Fraction;
    unit?: string;
    name: {
      singular: string;
      plural: string;
    };
    note?: string;
  };
}

const props = defineProps<{
  content: string;
  ingredientMultiplier: number;
  originalNumberOfServings: number;
  unitForms: IngredientUnitForm[];
}>();

const inlineIngredientsRef = ref<HTMLDivElement>();

const inlineIngredients = ref<InlineIngredientMarkup[]>([]);
onMounted(() => {
  const elements = inlineIngredientsRef.value?.querySelectorAll<HTMLElement>(".inline-ingredient");
  elements?.forEach((elem) => {
    const amount = Number(elem.dataset.amount);
    inlineIngredients.value.push({
      element: elem,
      data: {
        amount: isNaN(amount) ? undefined : new Fraction(amount),
        unit: elem.dataset.unit,
        name: {
          singular: elem.dataset.nameSingular ?? "",
          plural: elem.dataset.namePlural ?? "",
        },
        note: elem.dataset.note,
      },
    });
  });
});

watch(
  () => props.ingredientMultiplier,
  (newMultiplier) => multiplyInlineIngredients(newMultiplier),
);

const formatter = useRecipeFormatter();

function multiplyInlineIngredients(multiplicationFactor: number) {
  inlineIngredients.value.forEach((ingredient) => {
    if (!ingredient.data.amount) {
      return;
    }

    const currentAmount = ingredient.data.amount.mul(multiplicationFactor).div(props.originalNumberOfServings);

    const displayedIngredient = formatter.formatIngredient({
      amount: currentAmount,
      name: currentAmount.valueOf() <= 1 ? ingredient.data.name.singular : ingredient.data.name.plural,
      unit: getUnitLabel(ingredient.data.unit, currentAmount.valueOf()),
      note: "",
    });
    ingredient.element.textContent = displayedIngredient;
  });
}

function getUnitLabel(unit?: string, currentAmount?: number) {
  if (!unit) {
    return undefined;
  }
  // We can't switch between a singular and plural form if there's no number to use as a threshold
  if (!currentAmount) {
    return unit;
  }

  const multipleFormsUnit = props.unitForms.find((m) => m.singularForm === unit || m.pluralForm === unit);
  if (!multipleFormsUnit) {
    return unit;
  }

  return currentAmount <= 1 ? multipleFormsUnit.singularForm : multipleFormsUnit.pluralForm;
}
</script>

<style lang="scss" scoped>
.instruction {
  flex: 1;
}
</style>
<style lang="scss">
@use "@/styles/variables" as v;
.inline-ingredient {
  font-weight: v.$font-weight-bold;
}
</style>
