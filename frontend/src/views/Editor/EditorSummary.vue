<template>
  <n-form size="large">
    <x-input
      path="title"
      label="Title"
      :value="recipeStore.title"
      :errors="v$.title.$errors"
      required
      @input="handleTitleInput"
      @blur="v$.title.$touch()"
    />
    <x-upload path="imageSrc" :value="recipeStore.imageSrc" />
    <x-input
      path="note"
      label="Notes"
      type="textarea"
      :value="recipeStore.note"
      :autosize="{ minRows: 4, maxRows: 12 }"
      @input="handleInput"
    />
  </n-form>
</template>

<script>
import { XInput, XUpload } from "@/components";
import { NForm } from "naive-ui";
import { useVuelidate } from "@vuelidate/core";
import { useRecipeStore } from "@/store/recipeStore";
import { required } from "@vuelidate/validators";
import { recipeFormSteps } from "@/constants/enums";

export default {
  name: "EditorSummary",
  components: {
    XInput,
    XUpload,
    NForm,
  },
  setup() {
    const recipeStore = useRecipeStore();
    const step = recipeFormSteps.summary;
    const validationRules = {
      title: {
        required,
      },
    };
    return {
      recipeStore,
      v$: useVuelidate(validationRules, recipeStore),
      step,
    };
  },
  methods: {
    handleInput({ path, value }) {
      this.recipeStore.setValueAt(path, value);
      this.validateAt(path);
    },
    handleTitleInput({ path, value }) {
      this.handleInput({ path, value });
    },
    validateAt(path) {
      if (this.v$[path]) {
        this.v$[path].$touch();
      }
    },
  },
};
</script>
