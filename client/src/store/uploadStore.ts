import { defineStore } from "pinia";
import { ref } from "vue";

export const useUploadStore = defineStore("upload", () => {
  const recipeImage = ref<File>();
  return {
    recipeImage,
  };
});
