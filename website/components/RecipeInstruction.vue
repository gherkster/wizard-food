<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div ref="inlineIngredientsRef" class="instruction" v-html="content" />
</template>

<script setup lang="ts">
import { useRecipeFormatter } from "~/composables";
import type { ServerIngredient } from "common/types/serverRecipe";

interface InlineIngredientMarkup {
  element: HTMLElement;
  data: Omit<ServerIngredient, "id">;
}

const props = defineProps<{
  content: string;
  ingredientMultiplier: number;
  originalNumberOfServings: number;
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
        amount: isNaN(amount) ? undefined : amount,
        unit: elem.dataset.unit,
        name: elem.dataset.name ?? "",
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
const multipler = useIngredientMultiplier();

function multiplyInlineIngredients(multiplicationFactor: number) {
  inlineIngredients.value.forEach((ingredient) => {
    if (!ingredient.data.amount) {
      return;
    }

    const multipliedAmount = multipler.multiplyToFraction(
      ingredient.data.amount,
      multiplicationFactor,
      props.originalNumberOfServings,
    );
    const displayedIngredient = formatter.formatIngredient({ ...ingredient.data, amount: multipliedAmount });
    ingredient.element.textContent = displayedIngredient;
  });
}
</script>

<style lang="scss" scoped>
.instruction {
  flex: 1;
}
</style>
<style lang="scss">
.inline-ingredient {
  font-weight: bold;
}
</style>
