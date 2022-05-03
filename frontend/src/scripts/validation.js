export const slugPattern = /^[a-zA-Z\d](-?[a-zA-Z\d])*$/;

export function getFormInitialErrorState() {
  return {
    header: {
      title: "",
    },
    ingredients: [],
    instructions: [],
    servings: "",
    servingType: "",
    category: "",
    cuisine: "",
    preparationTime: {
      minutes: "",
      hours: "",
      days: "",
    },
    cookingTime: {
      minutes: "",
      hours: "",
      days: "",
    },
    customTime: {
      minutes: "",
      hours: "",
      days: "",
    },
    customTimeType: "",
    nutrition: {
      energy: "",
      protein: "",
      carbohydrates: "",
      fat: "",
      sodium: "",
    },
    slug: "",
  };
}
