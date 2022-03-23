export function mapRecipeToApi(recipe) {
  return {
    ...recipe,
    servings: recipe.servings || 0,
    preparationTimeDays: recipe.preparationTimeDays || 0,
    preparationTimeHours: recipe.preparationTimeHours || 0,
    preparationTimeMinutes: recipe.preparationTimeMinutes || 0,
    cookingTimeDays: recipe.cookingTimeDays || 0,
    cookingTimeHours: recipe.cookingTimeHours || 0,
    cookingTimeMinutes: recipe.cookingTimeMinutes || 0,
    customTimeDays: recipe.customTimeDays || 0,
    customTimeHours: recipe.customTimeHours || 0,
    customTimeMinutes: recipe.customTimeMinutes || 0,
    nutrition: {
      energy: recipe.nutrition.energy || 0,
      protein: recipe.nutrition.protein || 0,
      carbohydrates: recipe.nutrition.carbohydrates || 0,
      fat: recipe.nutrition.fat || 0,
      sodium: recipe.nutrition.sodium || 0,
    },
  };
}
