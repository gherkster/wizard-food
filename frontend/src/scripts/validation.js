import { recipeFormSteps } from "@/constants/enums";

export const slugPattern = /^[a-zA-Z\d](-?[a-zA-Z\d])*$/;

export const defaultErrorState = {
  message: "",
  status: null,
};

export function getFormInitialErrorState() {
  return {
    [recipeFormSteps.summary]: {
      title: {
        ...defaultErrorState,
      },
    },
    [recipeFormSteps.ingredientsAndInstructions]: {
      ingredientGroups: [],
      instructionGroups: [],
    },
    [recipeFormSteps.time]: {
      preparationTime: {
        minutes: {
          ...defaultErrorState,
        },
        hours: {
          ...defaultErrorState,
        },
        days: {
          ...defaultErrorState,
        },
      },
      cookingTime: {
        minutes: {
          ...defaultErrorState,
        },
        hours: {
          ...defaultErrorState,
        },
        days: {
          ...defaultErrorState,
        },
      },
      customTimes: [],
    },
    [recipeFormSteps.metadata]: {
      servings: {
        ...defaultErrorState,
      },
      category: {
        ...defaultErrorState,
      },
      cuisine: {
        ...defaultErrorState,
      },
      slug: {
        ...defaultErrorState,
      },
    },
  };
}
