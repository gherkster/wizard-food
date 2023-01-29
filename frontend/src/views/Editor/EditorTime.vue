<template>
  <n-form>
    <duration
      label="Preparation Time"
      :minutes="recipeStore.preparationTime.minutes"
      :hours="recipeStore.preparationTime.hours"
      :days="recipeStore.preparationTime.days"
      @input="handleInput"
    />
    <duration
      label="Cooking Time"
      :minutes="recipeStore.cookingTime.minutes"
      :hours="recipeStore.cookingTime.hours"
      :days="recipeStore.cookingTime.days"
      @input="handleInput"
    />
    <duration
      v-for="(customTime, index) in recipeStore.customTimes"
      :key="customTime.uuid"
      label="Custom Time"
      :minutes="customTime.minutes"
      :hours="customTime.hours"
      :days="customTime.days"
      custom
      :custom-name="customTime.name"
      :custom-time-types="customTimeTypes"
      @input="handleCustomTimeInputAtIndex($event, index)"
    />
    <n-button block @click="addCustomTimeGroup">Add Custom Time</n-button>
  </n-form>
</template>

<script>
import { useRecipeStore } from "@/store/recipeStore";
import { useVuelidate } from "@vuelidate/core";
import { NForm, NButton } from "naive-ui";
import { uuid } from "vue-uuid";
import Duration from "@/views/Editor/Duration.vue";

export default {
  name: "EditorTime",
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
    handleInput({ path, value }) {
      this.recipeStore.setValueAt(path, value);
    },
    async handleCustomTimeInputAtIndex(event, index) {
      this.recipeStore.setValueAt(["customTimes", index, event.path], event.value);
    },
    addCustomTimeGroup() {
      this.recipeStore.customTimes.push({
        uuid: uuid.v1(),
        days: "",
        hours: "",
        minutes: "",
        label: "",
      });
    },
    removeCustomTimeGroup(groupIndex) {
      this.recipeStore.customTimes.splice(groupIndex, 1);
    },
  },
};
</script>
