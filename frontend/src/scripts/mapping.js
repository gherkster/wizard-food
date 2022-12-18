export function mapRecipeStoreToApi(recipe) {
  return {
    ...recipe,
    servings: recipe.servings || 0,
    preparationDuration:
      recipe.preparationTime.minutes > 0 || recipe.preparationTime.hours > 0 || recipe.preparationTime.days > 0
        ? {
            name: "Preparation",
            minutes: recipe.preparationTime.minutes || 0,
            hours: recipe.preparationTime.hours || 0,
            days: recipe.preparationTime.days || 0,
          }
        : null,
    cookingDuration:
      recipe.cookingTime.minutes > 0 || recipe.preparationTime.hours > 0 || recipe.preparationTime.days > 0
        ? {
            name: "Cooking",
            minutes: recipe.cookingTime.minutes || 0,
            hours: recipe.cookingTime.hours || 0,
            days: recipe.cookingTime.days || 0,
          }
        : null,
    customDurations: recipe.customTimes
      .filter((ct) => ct.minutes > 0 || ct.hours > 0 || ct.days > 0)
      .map((ct) => {
        return {
          name: ct.name,
          minutes: ct.minutes || 0,
          hours: ct.hours || 0,
          days: ct.days || 0,
        };
      }),
  };
}
export function mapApiToRecipeStore(recipe) {
  return {
    ...recipe,
    servings: recipe.servings > 0 ? recipe.servings : "",
    preparationTime:
      recipe.preparationDuration !== null
        ? {
            minutes: recipe.preparationDuration.minutes || "",
            hours: recipe.preparationDuration.hours || "",
            days: recipe.preparationDuration.days || "",
          }
        : {
            minutes: "",
            hours: "",
            days: "",
          },
    cookingTime:
      recipe.cookingDuration !== null
        ? {
            minutes: recipe.cookingDuration.minutes || "",
            hours: recipe.cookingDuration.hours || "",
            days: recipe.cookingDuration.days || "",
          }
        : {
            minutes: "",
            hours: "",
            days: "",
          },
    customTimes: recipe.customDurations.map((cd) => {
      return {
        name: cd.name,
        minutes: cd.minutes || "",
        hours: cd.hours || "",
        days: cd.days || ""
      };
    }),
  };
}
