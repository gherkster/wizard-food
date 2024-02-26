export function useRecipeFormatter() {
  return {
    formatIngredient(ingredient: { amount?: number | string; name: string; unit?: string; note?: string }) {
      const amount = ingredient.amount?.toString() ?? "";
      const unit = ingredient.unit?.toString() ?? "";
      const note = ingredient.note ?? "";

      const value = `${amount} ${unit} ${ingredient.name} ${note}`;
      return value.trim();
    },
  };
}
