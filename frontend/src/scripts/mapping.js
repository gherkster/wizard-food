export function mapRecipeToApi(recipe) {
  return {
    ...recipe,
    servings: recipe.servings || 0,
    preparationTime: {
      minutes: recipe.preparationTime.minutes || 0,
      hours: recipe.preparationTime.hours || 0,
      days: recipe.preparationTime.days || 0,
    },
    cookingTime: {
      minutes: recipe.cookingTime.minutes || 0,
      hours: recipe.cookingTime.hours || 0,
      days: recipe.cookingTime.days || 0,
    },
    customTime: {
      minutes: recipe.customTime.minutes || 0,
      hours: recipe.customTime.hours || 0,
      days: recipe.customTime.days || 0,
    },
    nutrition: {
      energy: recipe.nutrition.energy || 0,
      protein: recipe.nutrition.protein || 0,
      carbohydrates: recipe.nutrition.carbohydrates || 0,
      fat: recipe.nutrition.fat || 0,
      sodium: recipe.nutrition.sodium || 0,
    },
  };
}
