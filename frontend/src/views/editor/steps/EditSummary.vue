<template>
  <n-form size="large">
    <x-row>
      <x-column col-12 col-md-6>
        <x-input
          path="title"
          label="Title"
          :value="recipeStore.title"
          :errors="v$.title.$errors"
          required
          @input="handleInput"
          @blur="v$.title.$touch()"
        />
      </x-column>
      <x-column col-12 col-md-6>
        <x-upload label="Image" description="Upload image" path="imageSrc" :value="recipeStore.imageSrc" />
      </x-column>
    </x-row>
    <x-row>
      <x-column col-12>
        <rich-text-editor :value="recipeStore.note" label="Notes" @input="handleInput({ path: 'note', value: $event })" />
      </x-column>
    </x-row>
  </n-form>
</template>

<script>
import { XRow, XColumn, XInput, XUpload, RichTextEditor } from "@/components";
import { NForm } from "naive-ui";
import { useVuelidate } from "@vuelidate/core";
import { useRecipeStore } from "@/store/recipeStore";
import { required } from "@vuelidate/validators";
import { recipeFormSteps } from "@/constants/enums";

export default {
  name: "EditSummary",
  components: {
    RichTextEditor,
    XRow,
    XColumn,
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
    validateAt(path) {
      if (this.v$[path]) {
        this.v$[path].$touch();
      }
    },
  },
};
</script>
