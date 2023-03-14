import { defineStore } from "pinia";
import { cloneDeep } from "lodash-es";
import { ref } from "vue";
import { Recipe } from "@/types/recipe";

export const useRecipeStore = defineStore(
  "recipe",
  () => {
    const initialState: Recipe = {
      id: 0,
      title: "",
      coverImage: undefined,
      rating: 0,
      note: "",
      ingredientGroups: [],
      instructionGroups: [],
      category: "",
      cuisine: "",
      servings: 0,
      preparationDuration: {
        days: 0,
        hours: 0,
        minutes: 0,
        name: "Preparation",
      },
      cookingDuration: {
        days: 0,
        hours: 0,
        minutes: 0,
        name: "Cooking",
      },
      customDurations: [],
      tags: [],
      slug: "",
    };
    const recipe = ref<Recipe>(cloneDeep(initialState));

    function $reset() {
      recipe.value = cloneDeep(initialState);
    }

    return {
      recipe,
      $reset,
    };
  },
  {
    persist: true,
  }
);
