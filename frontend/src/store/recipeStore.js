import { defineStore } from "pinia";
import { get, set } from "lodash";

export const useRecipeStore = defineStore("recipe", {
  state: () => {
    return {
      header: {
        title: "",
        rating: 0,
        description: "",
      },
      ingredients: [],
      instructions: [],
      category: "",
      cuisine: "",
      servings: "",
      servingType: "",
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
      customTime: {
        days: "",
        hours: "",
        minutes: "",
      },
      customTimeType: "",
      nutrition: {
        energy: "",
        protein: "",
        carbohydrates: "",
        fat: "",
        sodium: "",
      },
      tags: [],
      slug: "",
    };
  },
  actions: {
    /**
     * @param path Dot path to the value in the store being updated, e.g. header.title
     * @param value The value to update the store with
     */
    setValueAt(path, value) {
      const valueAtPath = get(this, path);

      if (Array.isArray(valueAtPath)) {
        set(this, path, [...value]);
      } else if (typeof valueAtPath === "object") {
        set(this, path, { ...value });
      } else {
        set(this, path, value);
      }
    },
  },
});
