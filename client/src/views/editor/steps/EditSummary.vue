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
        <x-upload label="Image" description="Upload image" path="imageSrc" :value="recipeStore.recipe.imageSrc" />
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
import { XRow, XColumn, XInput, XUpload, RichTextEditor } from "@/components";
import { NForm } from "naive-ui";
import { storeToRefs } from "pinia";
import { useVuelidate } from "@vuelidate/core";
import { useRecipeStore } from "@/store/recipeStore";
import { required } from "@vuelidate/validators";

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

function onNoteInput(value: string) {
  recipeStore.recipe.note = value;
}

</script>
