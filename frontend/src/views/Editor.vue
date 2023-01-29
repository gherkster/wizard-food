<template>
  <div class="page">
    <div class="content editor">
      <x-row class="editor__header">
        <h2>{{ isEditingExistingRecipe ? "Edit Recipe" : "New Recipe" }}</h2>
        <n-button v-if="isEditingExistingRecipe" class="editor__delete" type="error" @click="confirmDelete">Delete</n-button>
        <div class="editor__controls">
          <n-button type="primary" ghost v-if="currentStep !== steps.summary" @click="goToPreviousStep">Previous</n-button>
          <n-button type="primary" :disabled="currentStepContainsErrors" @click="goToNextStep">{{
            submitButtonLabel
          }}</n-button>
        </div>
      </x-row>
      <x-row class="editor__body">
        <!-- Stepper Header -->
        <x-column col-12 col-lg-4>
          <n-steps vertical :current="currentStepIndex + 1">
            <n-step title="Summary" />
            <n-step title="Ingredients & Instructions" />
            <n-step title="Time (optional)" />
            <n-step title="Metadata" />
          </n-steps>
        </x-column>
        <x-column col-12 col-lg-8>
          <!-- Stepper Step 1: Recipe Summary -->
          <editor-summary v-if="currentStep === steps.summary" :ref="steps.summary" />
          <!-- Stepper Step 2: Recipe Ingredients / Instructions -->
          <editor-ingredients-and-instructions
            v-else-if="currentStep === steps.ingredientsAndInstructions"
            :ref="steps.ingredientsAndInstructions"
            :units="units"
          />
          <!-- Stepper Step 3: Recipe Time -->
          <editor-time v-else-if="currentStep === steps.time" :custom-time-types="customTimeTypes" :ref="steps.time" />
          <!-- Stepper Step 4: Recipe Metadata -->
          <editor-metadata
            v-else-if="currentStep === steps.metadata"
            :categories="categories"
            :cuisines="cuisines"
            :tags="tags"
            :ref="steps.metadata"
          />
        </x-column>
      </x-row>
      <x-row class="mobile">
        <n-button type="primary" ghost v-if="currentStep !== steps.summary" @click="goToPreviousStep">Previous</n-button>
        <n-button type="primary" :disabled="currentStepContainsErrors" @click="goToNextStep">{{ submitButtonLabel }}</n-button>
      </x-row>
    </div>
  </div>
</template>

<script>
import { NButton, NSteps, NStep, useDialog } from "naive-ui";
import { mapApiToRecipeStore, mapRecipeStoreToApi } from "@/scripts/mapping";
import { recipeFormSteps } from "@/constants/enums";
import { useRecipeStore } from "@/store/recipeStore";
import { useVuelidate } from "@vuelidate/core";
import { useAlertStore } from "@/store/alertStore";
import { XRow, XColumn } from "@/components";
import apis from "@/constants/apis";
import EditorTime from "@/views/Editor/EditorTime.vue";
import EditorSummary from "@/views/Editor/EditorSummary.vue";
import EditorMetadata from "@/views/Editor/EditorMetadata.vue";
import { useAxios } from "@/composables";
import EditorIngredientsAndInstructions from "@/views/Editor/EditorIngredientsAndInstructions.vue";

export default {
  name: "Editor",
  components: {
    XColumn,
    EditorIngredientsAndInstructions,
    EditorTime,
    XRow,
    NSteps,
    NStep,
    NButton,
    EditorSummary,
    EditorMetadata,
  },
  setup() {
    const recipeStore = useRecipeStore();
    const alertStore = useAlertStore();
    const axios = useAxios();
    const dialog = useDialog();

    return {
      recipeStore,
      alertStore,
      axios,
      steps: recipeFormSteps,
      dialog,
      v$: useVuelidate(),
    };
  },
  data: () => ({
    timeOptions: ["minutes", "hours", "days"],
    customTimeTypes: [],
    categories: [],
    cuisines: [],
    tags: [],
    units: [],
    currentStep: recipeFormSteps.summary,
    isSlugGenerating: false,
    isSubmitting: false,
    existingRecipeId: null,
  }),
  async beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.currentStep = recipeFormSteps.summary;
      // Clear all pre-filled inputs if navigating away to create a new recipe, otherwise populate with the existing recipe input values
      if (to.path === "/new") {
        vm.recipeStore.$reset();
      } else if (to.params?.slug) {
        vm.populateInputsWithExistingRecipe();
      }
    });
  },
  created() {
    this.axios
      .get(apis.dropdownOptions)
      .then((response) => {
        this.categories = response.data.categories.map((c) => ({ label: c.label, value: c.label }));
        this.cuisines = response.data.cuisines.map((c) => ({ label: c.label, value: c.label }));
        this.customTimeTypes = response.data.customTimeTypes.map((ct) => ({ label: ct.label, value: ct.label }));
        this.tags = response.data.tags.map((t) => ({ label: t.label, value: t.label }));
        this.units = response.data.units.map((u) => ({ label: u.label, value: u.label }));
      })
      .catch((error) => console.log(error));
  },
  computed: {
    isEditingExistingRecipe() {
      return !!this.$route.params.slug;
    },
    currentStepIndex() {
      return Object.keys(this.steps).indexOf(this.currentStep);
    },
    currentStepContainsErrors() {
      return this.v$.$errors.length > 0;
    },
    isOnLastStep() {
      return this.currentStep === recipeFormSteps.metadata;
    },
    submitButtonLabel() {
      if (this.isOnLastStep) {
        return this.isEditingExistingRecipe ? "Update Recipe" : "Create Recipe";
      } else {
        return "Next";
      }
    },
  },
  methods: {
    populateInputsWithExistingRecipe() {
      this.axios
        .get(apis.recipes + this.$route.params.slug)
        .then((response) => {
          this.existingRecipeId = response.data.id;
          this.recipeStore.$patch({
            ...mapApiToRecipeStore(response.data),
          });
        })
        .catch((error) => console.log(error));
    },
    handleInput({ path, value }) {
      this.recipeStore.setValueAt(path, value);
      if (this.v$[path]) {
        this.v$[path].$touch();
      }
    },
    async handleBlur({ path }) {
      if (this.v$[path]) {
        this.v$[path].$touch();
      }
    },
    async submit() {
      this.isSubmitting = true;
      if (this.isEditingExistingRecipe) {
        await this.axios
          .put(apis.recipes + this.existingRecipeId, mapRecipeStoreToApi(this.recipeStore))
          .then(() => {
            this.alertStore.showSuccessAlert("Recipe updated!");
            this.$router.push(`/recipes/${this.recipeStore.slug}`);
          })
          .catch((error) => {
            this.alertStore.showErrorAlert("An error occurred while updating the recipe");
            console.log(error);
          })
          .finally(() => (this.isSubmitting = false));
      } else {
        await this.axios
          .post(apis.recipes, mapRecipeStoreToApi(this.recipeStore))
          .then(() => {
            this.alertStore.showSuccessAlert("Recipe created!");
            this.$router.push(`/recipes/${this.recipeStore.slug}`);
          })
          .catch((error) => {
            this.alertStore.showErrorAlert("An error occurred while creating the recipe");
            console.log(error);
          })
          .finally(() => (this.isSubmitting = false));
      }
    },
    confirmDelete() {
      this.dialog.warning({
        title: "Permanently delete recipe?",
        positiveText: "Delete",
        negativeText: "No",
        closable: false,
        onPositiveClick: async () => await this.deleteRecipe(),
      });
    },
    async deleteRecipe() {
      await this.axios({
        method: "delete",
        url: apis.recipes + this.recipeStore.slug,
      })
        .then(() => {
          this.recipeStore.$reset();
          this.alertStore.showSuccessAlert("Recipe deleted");
          this.$router.replace("/recipes");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async goToNextStep() {
      await this.v$.$validate();
      if (this.currentStepContainsErrors) {
        return;
      }
      switch (this.currentStep) {
        case recipeFormSteps.summary:
          this.currentStep = recipeFormSteps.ingredientsAndInstructions;
          break;
        case recipeFormSteps.ingredientsAndInstructions:
          this.currentStep = recipeFormSteps.time;
          break;
        case recipeFormSteps.time:
          this.currentStep = recipeFormSteps.metadata;
          break;
        case recipeFormSteps.metadata:
          await this.submit();
          break;
      }
    },
    goToPreviousStep() {
      switch (this.currentStep) {
        case recipeFormSteps.metadata:
          this.currentStep = recipeFormSteps.time;
          break;
        case recipeFormSteps.time:
          this.currentStep = recipeFormSteps.ingredientsAndInstructions;
          break;
        case recipeFormSteps.ingredientsAndInstructions:
          this.currentStep = recipeFormSteps.summary;
          break;
      }
    },
  },
};
</script>
