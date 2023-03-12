import { defineStore } from "pinia";
import { get, set, PropertyPath, cloneDeep } from "lodash";
import { ref } from "vue";
import { Recipe } from "@/types/recipe";

export const useRecipeStore = defineStore(
  "recipe",
  () => {
    const initialState: Recipe = {
      id: 0,
      title: "",
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
    const recipe = ref(cloneDeep(initialState));

    function setValueAt(path: PropertyPath, value: any) {
      const valueAtPath = get(recipe.value, path);

      if (Array.isArray(valueAtPath)) {
        set(recipe.value, path, [...value]);
      } else if (typeof valueAtPath === "object" && valueAtPath !== null) {
        set(recipe.value, path, { ...value });
      } else {
        set(recipe.value, path, value ?? "");
      }
    }

    function $reset() {
      recipe.value = cloneDeep(initialState);
    }

    return {
      recipe,
      setValueAt,
      $reset,
    };
  },
  {
    persist: true,
  }
);
