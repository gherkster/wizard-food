<template>
  <n-form size="large">
    <duration
      label="Preparation Time"
      :minutes="recipeStore.recipe.preparationTime.minutes"
      :hours="recipeStore.recipe.preparationTime.hours"
      :days="recipeStore.recipe.preparationTime.days"
      @input="onPreparationTimeInput"
    />
    <duration
      label="Cooking Time"
      :minutes="recipeStore.recipe.cookingTime.minutes"
      :hours="recipeStore.recipe.cookingTime.hours"
      :days="recipeStore.recipe.cookingTime.days"
      @input="onCookingTimeInput"
    />
    <duration
      v-for="(customTime, index) in recipeStore.recipe.customTimes"
      :key="customTime.uuid"
      label="Custom Time"
      :minutes="customTime.minutes"
      :hours="customTime.hours"
      :days="customTime.days"
      custom
      :custom-name="customTime.name"
      :custom-time-types="customTimeTypes"
      @input="handleCustomTimeInputAtIndex($event, index)"
      @blur="handleCustomTimeInputAtIndex($event, index)"
    />
    <n-button type="primary" block tertiary @click="addCustomTimeGroup">Add Custom Time</n-button>
  </n-form>
</template>

<script>
import { useRecipeStore } from "@/store/recipeStore";
import { useVuelidate } from "@vuelidate/core";
import { NForm, NButton } from "naive-ui";
import { uuid } from "vue-uuid";
import Duration from "@/views/editor/components/Duration.vue";

export default {
  name: "EditTimes",
  components: {
    Duration,
    NForm,
    NButton,
  },
  props: {
    customTimeTypes: {
      type: Array,
      required: true,
    },
  },
  setup() {
    return {
      recipeStore: useRecipeStore(),
      v$: useVuelidate(),
    };
  },
  methods: {
    onPreparationTimeInput({ path, value }) {
      this.recipeStore.setValueAt(["preparationTime", path], value);
    },
    onCookingTimeInput({ path, value }) {
      this.recipeStore.setValueAt(["cookingTime", path], value);
    },
    async handleCustomTimeInputAtIndex(event, index) {
      this.recipeStore.setValueAt(["customTimes", index, event.path], event.value);
    },
    addCustomTimeGroup() {
      this.recipeStore.recipe.customTimes.push({
        uuid: uuid.v1(),
        days: "",
        hours: "",
        minutes: "",
        label: "",
      });
    },
    removeCustomTimeGroup(groupIndex) {
      this.recipeStore.recipe.customTimes.splice(groupIndex, 1);
    },
  },
};
</script>
