<template>
  <n-form size="large">
    <duration
      label="Preparation Time"
      :duration="recipeStore.recipe.preparationDuration"
      @input="onPreparationTimeInput"
    />
    <duration
      label="Cooking Time"
      :duration="recipeStore.recipe.cookingDuration"
      @input="onCookingTimeInput"
    />
    <duration
      v-for="(customTime, index) in recipeStore.recipe.customDurations"
      :key="customTime.uuid"
      label="Custom Time"
      :duration="customTime"
      custom
      :custom-time-types="customTimeTypes"
      @input="handleCustomTimeInputAtIndex($event, index)"
    />
    <n-button type="primary" block tertiary @click="addCustomTimeGroup">Add Custom Time</n-button>
  </n-form>
</template>

<script setup lang="ts">
import { useRecipeStore } from "@/store/recipeStore";
import { useVuelidate } from "@vuelidate/core";
import { NForm, NButton } from "naive-ui";
import Duration from "@/views/editor/components/Duration.vue";
import { ValueLabelPair } from "@/types/form";
import { RecipeDuration } from "@/types/recipe";

const props = defineProps<{
  customTimeTypes: Array<ValueLabelPair>;
}>();

const recipeStore = useRecipeStore();
const v$ = useVuelidate();

function onPreparationTimeInput(value: RecipeDuration) {
  recipeStore.recipe.preparationDuration = value;
}

function onCookingTimeInput(value: RecipeDuration) {
  recipeStore.recipe.cookingDuration = value;
}

function handleCustomTimeInputAtIndex(value: RecipeDuration, index: number) {
  recipeStore.recipe.customDurations[index] = value;
}

function addCustomTimeGroup() {
  recipeStore.recipe.customDurations.push({
    days: 0,
    hours: 0,
    minutes: 0,
    name: "",
  });
}
</script>
