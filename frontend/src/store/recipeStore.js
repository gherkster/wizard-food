import { defineStore } from "pinia";
import { get, set } from "lodash";

export const useRecipeStore = defineStore("recipe", {
  state: () => ({
    title: "",
    rating: 0,
    imageSrc: "",
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
  }),
  actions: {
    /**
     * @param path Dot path to the value in the store being updated, e.g. header.title
     * @param value The value to update the store with
     */
    setValueAt(path, value) {
      const valueAtPath = get(this, path);

      if (Array.isArray(valueAtPath)) {
        set(this, path, [...value]);
      } else if (typeof valueAtPath === "object" && valueAtPath !== null) {
        set(this, path, { ...value });
      } else {
        set(this, path, value ?? "");
      }
    },
  },
});
