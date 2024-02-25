import { ServerIngredient } from "../types/serverRecipe";

export function useRecipeFormatter() {
  return {
    formatIngredient(ingredient: ServerIngredient) {
      const value = `${ingredient.amount}${ingredient.unit} ${ingredient.name} ${ingredient.note}`;

      return value.trim();
    },
  };
}
