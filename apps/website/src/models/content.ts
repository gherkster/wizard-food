export type RecipeSearch = {
  search?: string;
  cuisine?: string;
  ingredient?: string;
  cookingStyle?: string;
  diet?: "vegetarian" | "vegan";
  prepTime?: "under-30" | "30-60" | "60-plus";
};
