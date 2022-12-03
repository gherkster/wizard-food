export const slugPattern = /^[a-zA-Z\d](-?[a-zA-Z\d])*$/;

const defaultStatus = {
  message: "",
  status: null,
};

export function getFormInitialErrorState() {
  return {
    title: {
      ...defaultStatus,
    },
    ingredientGroups: [],
    instructionGroups: [],
    servings: {
      ...defaultStatus,
    },
    servingType: {
      ...defaultStatus,
    },
    category: {
      ...defaultStatus,
    },
    cuisine: {
      ...defaultStatus,
    },
    preparationTime: {
      minutes: {
        ...defaultStatus,
      },
      hours: {
        ...defaultStatus,
      },
      days: {
        ...defaultStatus,
      },
    },
    cookingTime: {
      minutes: {
        ...defaultStatus,
      },
      hours: {
        ...defaultStatus,
      },
      days: {
        ...defaultStatus,
      },
    },
    customTimes: [],
    nutrition: {
      energy: {
        ...defaultStatus,
      },
      protein: {
        ...defaultStatus,
      },
      carbohydrates: {
        ...defaultStatus,
      },
      fat: {
        ...defaultStatus,
      },
      sodium: {
        ...defaultStatus,
      },
    },
    slug: {
      ...defaultStatus,
    },
  };
}
