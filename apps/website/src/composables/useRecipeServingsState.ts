import { ref, type Ref } from "vue";

const servingsByRecipeKey = new Map<string, Ref<number>>();

export function useRecipeServingsState(recipeKey: string, initialServings: number) {
  const normalizedInitialServings = initialServings > 0 ? initialServings : 1;

  let servings = servingsByRecipeKey.get(recipeKey);
  if (!servings) {
    servings = ref(normalizedInitialServings);
    servingsByRecipeKey.set(recipeKey, servings);
  }

  const setServings = (nextServings: number) => {
    servings.value = nextServings > 0 ? nextServings : 1;
  };

  return {
    servings,
    setServings,
    originalServings: normalizedInitialServings,
  };
}
