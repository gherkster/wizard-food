<template>
  <div class="page">
    <div class="content editor">
      <x-row class="editor__header">
        <h2>{{ isEditingExistingRecipe ? "Edit Recipe" : "New Recipe" }}</h2>
        <x-button v-if="isEditingExistingRecipe" class="editor__delete" icon="fa-trash" type="error" @click="confirmDelete"
          >Delete</x-button
        >
        <x-button @click="createTestRecipe">Create test recipe</x-button>
        <div class="editor__controls">
          <x-button v-if="currentStep !== steps.summary" type="primary" size="large" icon="fa-chevron-left" ghost @click="goToPreviousStep"
            >Back</x-button
          >
          <x-button
            type="primary"
            size="large"
            :icon="nextButtonIcon"
            icon-position="end"
            :disabled="currentStepContainsErrors"
            @click="goToNextStep"
            >{{ nextButtonLabel }}
          </x-button>
        </div>
      </x-row>
      <x-row class="editor__body">
        <!-- Stepper Header -->
        <x-column col-12 col-lg-4>
          <div class="editor__progress">
            <n-steps vertical :current="currentStepIndex + 1">
              <n-step title="Summary" />
              <n-step title="Ingredients" />
              <n-step title="Instructions" />
              <n-step title="Times" />
              <n-step title="Metadata" />
            </n-steps>
          </div>
          <div class="editor__progress mobile">
            <n-progress type="circle" :percentage="currentProgressPercentage" :stroke-width="12">
              <b>{{ currentProgressLabel }}</b>
            </n-progress>
            <div class="editor__progress-label">
              <h3>{{ currentStepTitle }}</h3>
              <span>Next: {{ nextStepTitle }}</span>
            </div>
          </div>
        </x-column>
        <x-column col-12 col-lg-8>
          <!-- editor Step 1: Recipe Summary -->
          <edit-intro v-if="currentStep === steps.summary" :ref="steps.summary" />
          <!-- editor Step 2: Recipe Ingredients -->
          <edit-ingredients v-else-if="currentStep === steps.ingredients" :ref="steps.ingredients" :units="units" />
          <!-- editor Step 3: Recipe Ingredients -->
          <edit-instructions v-else-if="currentStep === steps.instructions" :ref="steps.instructions" />
          <!-- editor Step 4: Recipe Times -->
          <edit-times v-else-if="currentStep === steps.time" :custom-time-types="customTimeTypes" :ref="steps.time" />
          <!-- editor Step 5: Recipe Metadata -->
          <edit-metadata
            v-else-if="currentStep === steps.metadata"
            :categories="categories"
            :cuisines="cuisines"
            :tags="tags"
            :ref="steps.metadata"
          />
        </x-column>
      </x-row>
      <x-row class="editor__controls mobile">
        <x-button v-if="currentStep !== steps.summary" type="primary" size="large" icon="fa-chevron-left" ghost @click="goToPreviousStep"
          >Back</x-button
        >
        <x-button
          type="primary"
          size="large"
          :icon="nextButtonIcon"
          icon-position="end"
          :disabled="currentStepContainsErrors"
          @click="goToNextStep"
          >{{ nextButtonLabel }}
        </x-button>
      </x-row>
    </div>
  </div>
</template>

<script>
import { NSteps, NStep, NProgress, useDialog } from "naive-ui";
import { mapApiToRecipeStore, mapRecipeStoreToApi } from "@/scripts/mapping";
import { recipeFormSteps } from "@/constants/enums";
import { useRecipeStore } from "@/store/recipeStore";
import { useVuelidate } from "@vuelidate/core";
import { useAlertStore } from "@/store/alertStore";
import { XRow, XColumn, XButton } from "@/components";
import { EditIntro, EditIngredients, EditInstructions, EditTimes, EditMetadata } from "@/views/editor/steps";
import apis from "@/constants/apis";
import { useAxios } from "@/composables";

export default {
  name: "Editor",
  components: {
    XColumn,
    XRow,
    NSteps,
    NStep,
    NProgress,
    XButton,
    EditIntro,
    EditIngredients,
    EditInstructions,
    EditTimes,
    EditMetadata,
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
      v$: useVuelidate({ $lazy: true }),
    };
  },
  data: () => ({
    currentStep: recipeFormSteps.summary,
    stepTitles: {
      [recipeFormSteps.summary]: "Summary",
      [recipeFormSteps.ingredients]: "Ingredients",
      [recipeFormSteps.instructions]: "Instructions",
      [recipeFormSteps.time]: "Times",
      [recipeFormSteps.metadata]: "Metadata",
    },
    isSubmitting: false,
    existingRecipeId: null,
  }),
  beforeRouteEnter(to, from, next) {
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
        this.units = response.data.units.map((u) => ({ label: u, value: u }));
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
    currentProgressPercentage() {
      if (this.isSubmitting) {
        return 100;
      } else {
        return this.currentStepIndex * 20;
      }
    },
    currentProgressLabel() {
      return `${this.currentStepIndex + 1} of ${Object.keys(recipeFormSteps).length}`;
    },
    currentStepContainsErrors() {
      return this.v$.$errors.length > 0;
    },
    currentStepTitle() {
      return this.stepTitles[this.currentStep];
    },
    nextStepTitle() {
      const stepProperties = Object.values(this.stepTitles);
      if (this.currentStepIndex < stepProperties.length - 1) {
        return stepProperties[this.currentStepIndex + 1];
      }
      return "";
    },
    nextButtonLabel() {
      switch (this.currentStep) {
        case recipeFormSteps.summary:
          return "Add ingredients";
        case recipeFormSteps.ingredients:
          return "Add instructions";
        case recipeFormSteps.instructions:
          return "Add times";
        case recipeFormSteps.time:
          return "Add final details";
        case recipeFormSteps.metadata:
          return this.isEditingExistingRecipe ? "Save changes" : "Create recipe";
        default:
          return "";
      }
    },
    nextButtonIcon() {
      switch (this.currentStep) {
        case recipeFormSteps.summary:
        case recipeFormSteps.ingredients:
        case recipeFormSteps.instructions:
        case recipeFormSteps.time:
          return "fa-chevron-right";
        case recipeFormSteps.metadata:
          return this.isEditingExistingRecipe ? "fa-pen" : "fa-plus";
        default:
          return "";
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
            recipe: {
              ...mapApiToRecipeStore(response.data),
            },
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
          .put(apis.recipes + this.existingRecipeId, mapRecipeStoreToApi(this.recipeStore.recipe))
          .then(() => {
            this.alertStore.showSuccessAlert("Recipe updated!");
            this.$router.push(`/recipes/${this.recipeStore.recipe.slug}`);
          })
          .catch((error) => {
            this.alertStore.showErrorAlert("An error occurred while updating the recipe");
            console.log(error);
          })
          .finally(() => (this.isSubmitting = false));
      } else {
        await this.axios
          .post(apis.recipes, mapRecipeStoreToApi(this.recipeStore.recipe))
          .then(() => {
            this.alertStore.showSuccessAlert("Recipe created!");
            this.$router.push(`/recipes/${this.recipeStore.recipe.slug}`);
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
        url: apis.recipes + this.recipeStore.recipe.slug,
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
          this.currentStep = recipeFormSteps.ingredients;
          break;
        case recipeFormSteps.ingredients:
          this.currentStep = recipeFormSteps.instructions;
          break;
        case recipeFormSteps.instructions:
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
          this.currentStep = recipeFormSteps.instructions;
          break;
        case recipeFormSteps.instructions:
          this.currentStep = recipeFormSteps.ingredients;
          break;
        case recipeFormSteps.ingredients:
          this.currentStep = recipeFormSteps.summary;
          break;
      }
    },
    async createTestRecipe() {
      const recipe = {
        id: 1,
        title: "test recipe",
        note: "<p><strong>1. test</strong> - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p><strong>2. test - </strong>Duis turpis lorem, blandit in ante ac, feugiat dictum.&nbsp;</p><p><strong>3. test</strong> - Nulla ornare mauris viverra nisi ultrices iaculis. Maecenas egestas ultricies elit.</p>",
        ingredientGroups: [
          {
            name: "",
            ingredients: [
              { amount: 1.0, unit: "", name: "bread rolls", note: "" },
              { amount: 3.0, unit: "tbsp", name: "green cabbage", note: "" },
              { amount: 1.0, unit: "tbsp", name: "chicken mince", note: "" },
              { amount: 6.0, unit: "", name: "green onion stems", note: "cut into the length of the rolls" },
              { amount: 6.0, unit: "slices", name: "test", note: "" },
              { amount: 3.0, unit: "slices", name: "roast pork", note: "" },
              { amount: 1.0, unit: "", name: "cucumbers", note: "finely sliced" },
              { amount: 3.0, unit: "", name: "chillies", note: "finely sliced" },
            ],
          },
          {
            name: "Pickled pickles",
            ingredients: [
              { amount: 3.0, unit: "", name: "carrots", note: 'peeled, cut into 2-3mm / 1/10" batons' },
              { amount: 200.0, unit: "ml", name: "hot water", note: "" },
              { amount: 50.0, unit: "g", name: "sugar", note: "" },
              { amount: 4.0, unit: "tsp", name: "salt", note: "" },
              { amount: 100.0, unit: "ml", name: "rice vinegar", note: "" },
            ],
          },
        ],
        instructionGroups: [
          {
            name: "",
            instructions: [
              { label: "Split rolls down the centre" },
              { label: "Spread around pate." },
              { label: "Stuff in ham, cucumber slices and green onion." },
              { label: "Add carrots and coriander." },
              { label: "Sprinkle with fresh chilli" },
              { label: "Close sandwich and eat" },
            ],
          },
          {
            name: "Pickled pickles",
            instructions: [{ label: "Dissolve salt and sugar" }, { label: "Add carrot" }, { label: "Drain and use per recipe." }],
          },
        ],
        category: "sandwich",
        cuisine: "vietnamese",
        rating: 0.0,
        servings: 4.0,
        preparationDuration: { name: "Preparation", minutes: 30, hours: 0, days: 0 },
        cookingDuration: null,
        customDurations: [{ name: "pickling", minutes: 0, hours: 1, days: 0 }],
        tags: ["easy", "lunch", "quick"],
        slug: Math.floor(Math.random() * 1000).toString(),
      };
      await this.axios.post(apis.recipes, recipe);
    },
  },
};
</script>
