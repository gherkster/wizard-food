import { defineStore } from "pinia";
import { get, set, PropertyPath, cloneDeep } from "lodash";
import { ref } from "vue";

export const useRecipeStore = defineStore(
  "recipe",
  () => {
    const initialState = {
      title: "",
      rating: 0,
      note: "",
      ingredientGroups: [],
      instructionGroups: [],
      category: "",
      cuisine: "",
      servings: "",
      preparationTime: {
        days: "",
        hours: "",
        minutes: "",
      },
      cookingTime: {
        days: "",
        hours: "",
        minutes: "",
      },
      customTimes: [],
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
