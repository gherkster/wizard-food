<template>
  <n-form size="large">
    <x-row>
      <x-column col-12 col-md-6>
        <x-input
          path="title"
          label="Title"
          :value="recipeStore.recipe.title"
          :errors="v$.title.$errors"
          required
          @input="onTitleInput"
          @blur="v$.title.$touch()"
        />
      </x-column>
      <x-column col-12 col-md-6>
        <x-upload label="Image" description="Upload image" path="imageSrc" :value="recipeStore.recipe.imageSrc" @change="onFileSelect" />
      </x-column>
    </x-row>
    <x-row>
      <x-column col-12>
        <rich-text-editor :value="recipeStore.recipe.note" label="Notes" @input="onNoteInput" />
      </x-column>
    </x-row>
  </n-form>
</template>

<script setup lang="ts">
import { XRow, XColumn, XInput, XUpload } from "@/components";
import { RichTextEditor } from "@/views/editor/components";
import { NForm } from "naive-ui";
import { storeToRefs } from "pinia";
import { useVuelidate } from "@vuelidate/core";
import { useRecipeStore } from "@/store/recipeStore";
import { required } from "@vuelidate/validators";
import { useUploadStore } from "@/store/uploadStore";

const recipeStore = useRecipeStore();
const { recipe } = storeToRefs(recipeStore);
const validationRules = {
  title: {
    required,
  },
};

const v$ = useVuelidate(validationRules, recipe);

function onTitleInput(value: string) {
  recipeStore.recipe.title = value;
  v$.value.title.$touch();
}

// Store uploaded file in the store temporarily until the form is completed. This has two benefits:
// 1. The file is only uploaded if the editor is submitted, so the backend doesn't need to handle the image being changed or removed partway
// 2. The backend doesn't need to create a session and persist the image across multiple steps
const uploadStore = useUploadStore();
function onFileSelect(files: Array<File>) {
  uploadStore.recipeImage = files[0];
}

function onNoteInput(value: string) {
  recipeStore.recipe.note = value;
}
</script>
