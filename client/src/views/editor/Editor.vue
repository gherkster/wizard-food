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
          <edit-summary v-if="currentStep === steps.summary" :ref="steps.summary" />
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

<script setup lang="ts">
import { NSteps, NStep, NProgress, useDialog } from "naive-ui";
import { recipeFormSteps } from "@/constants/enums";
import { useAlertStore, useRecipeStore } from "@/store";
import { useVuelidate } from "@vuelidate/core";
import { XRow, XColumn, XButton } from "@/components";
import { EditSummary, EditIngredients, EditInstructions, EditTimes, EditMetadata } from "./steps";
import apis from "@/constants/apis";
import { useAxios } from "@/composables";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DropdownOptions, Recipe } from "@/types/recipe";

const recipeStore = useRecipeStore();
const alertStore = useAlertStore();
const axios = useAxios();
const dialog = useDialog();
const router = useRouter();
const route = useRoute();

const steps = recipeFormSteps;
const stepTitles = ["Summary", "Ingredients", "Instructions", "Times", "Metadata"];
const v$ = useVuelidate({ $lazy: true });

const currentStep = ref(recipeFormSteps.summary);
const isSubmitting = ref(false);
const existingRecipeId = ref(0);

// Ensure that the form is in the correct state based on how the user routes to it
// 1. The top level statement is triggered when the component is created new, i.e. when navigating from a completely separate page component
// 2. The watch statement is triggered when the component is reused,
// i.e. when already in the editor for an existing recipe and clicking "New Recipe",
// or clicking the browser back button to return to the existing recipe editor.
resetStateIfRequired();
watch(
  () => [route.params, route.path],
  async () => {
    resetStateIfRequired();
  }
);

function resetStateIfRequired() {
  currentStep.value = recipeFormSteps.summary;
  // Clear all pre-filled inputs if navigating away to create a new recipe,
  // otherwise populate with the existing recipe input values
  if (route.path === "/new") {
    recipeStore.$reset();
  } else if (route.params.slug) {
    populateInputsWithExistingRecipe();
  }
}

const { data } = await axios.get<DropdownOptions>(apis.dropdownOptions);
const categories = ref(data.categories.map((c) => ({ label: c, value: c })));
const cuisines = ref(data.cuisines.map((c) => ({ label: c, value: c })));
const customTimeTypes = ref(data.customTimeTypes.map((ct) => ({ label: ct, value: ct })));
const tags = ref(data.tags.map((t) => ({ label: t, value: t })));
const units = ref(data.units.map((u) => ({ label: u, value: u })));

const isEditingExistingRecipe = computed(() => {
  return !!route.params.slug;
});

const currentStepIndex = computed(() => {
  return Object.keys(steps).indexOf(currentStep.value);
});

const currentProgressPercentage = computed(() => {
  if (isSubmitting.value) {
    return 100;
  } else {
    return currentStepIndex.value * 20;
  }
});

const currentProgressLabel = computed(() => {
  return `${currentStepIndex.value + 1} of ${Object.keys(recipeFormSteps).length}`;
});

const currentStepContainsErrors = computed(() => {
  return v$.value.$errors.length > 0;
});

const currentStepTitle = computed<string>(() => {
  return stepTitles[currentStepIndex.value];
});

const nextStepTitle = computed(() => {
  const stepProperties = Object.values(stepTitles);
  if (currentStepIndex.value < stepProperties.length - 1) {
    return stepProperties[currentStepIndex.value + 1];
  }
  return "";
})
const nextButtonLabel = computed(() => {
  switch (currentStep.value) {
    case recipeFormSteps.summary:
      return "Add ingredients";
    case recipeFormSteps.ingredients:
      return "Add instructions";
    case recipeFormSteps.instructions:
      return "Add times";
    case recipeFormSteps.time:
      return "Add final details";
    case recipeFormSteps.metadata:
      return isEditingExistingRecipe.value ? "Save changes" : "Create recipe";
    default:
      return "";
  }
})
const nextButtonIcon = computed(() => {
  switch (currentStep.value) {
    case recipeFormSteps.summary:
    case recipeFormSteps.ingredients:
    case recipeFormSteps.instructions:
    case recipeFormSteps.time:
      return "fa-chevron-right";
    case recipeFormSteps.metadata:
      return isEditingExistingRecipe.value ? "fa-pen" : "fa-plus";
    default:
      return "";
  }
})

function populateInputsWithExistingRecipe() {
  axios
    .get<Recipe>(apis.recipes + route.params.slug)
    .then((response) => {
      existingRecipeId.value = response.data.id;
      recipeStore.$patch({
        recipe: response.data,
      });
    })
    .catch((error) => console.log(error));
}

async function submit() {
  isSubmitting.value = true;
  if (isEditingExistingRecipe.value) {
    await axios
      .put(apis.recipes + existingRecipeId.value, recipeStore.recipe)
      .then(() => {
        alertStore.showSuccessAlert("Recipe updated!");
        router.push(`/recipes/${recipeStore.recipe.slug}`);
      })
      .catch((error) => {
        alertStore.showErrorAlert("An error occurred while updating the recipe");
        console.log(error);
      })
      .finally(() => (isSubmitting.value = false));
  } else {
    await axios
      .post(apis.recipes, recipeStore.recipe)
      .then(() => {
        alertStore.showSuccessAlert("Recipe created!");
        router.push(`/recipes/${recipeStore.recipe.slug}`);
      })
      .catch((error) => {
        alertStore.showErrorAlert("An error occurred while creating the recipe");
        console.log(error);
      })
      .finally(() => (isSubmitting.value = false));
  }
}

function confirmDelete() {
  dialog.warning({
    title: "Permanently delete recipe?",
    positiveText: "Delete",
    negativeText: "No",
    closable: false,
    onPositiveClick: async () => await deleteRecipe(),
  });
}

async function deleteRecipe() {
  await axios({
    method: "delete",
    url: apis.recipes + recipeStore.recipe.slug,
  })
    .then(() => {
      recipeStore.$reset();
      alertStore.showSuccessAlert("Recipe deleted");
      router.replace("/recipes");
    })
    .catch((error) => {
      console.log(error);
    });
}

async function goToNextStep() {
  await v$.value.$validate();
  if (currentStepContainsErrors.value) {
    return;
  }
  switch (currentStep.value) {
    case recipeFormSteps.summary:
      currentStep.value = recipeFormSteps.ingredients;
      break;
    case recipeFormSteps.ingredients:
      currentStep.value = recipeFormSteps.instructions;
      break;
    case recipeFormSteps.instructions:
      currentStep.value = recipeFormSteps.time;
      break;
    case recipeFormSteps.time:
      currentStep.value = recipeFormSteps.metadata;
      break;
    case recipeFormSteps.metadata:
      await submit();
      break;
  }
}

function goToPreviousStep() {
  switch (currentStep.value) {
    case recipeFormSteps.metadata:
      currentStep.value = recipeFormSteps.time;
      break;
    case recipeFormSteps.time:
      currentStep.value = recipeFormSteps.instructions;
      break;
    case recipeFormSteps.instructions:
      currentStep.value = recipeFormSteps.ingredients;
      break;
    case recipeFormSteps.ingredients:
      currentStep.value = recipeFormSteps.summary;
      break;
  }
}

async function createTestRecipe() {
  const recipe: Recipe = {
    id: 1,
    title: "test recipe",
    note: "<p><strong>1. test</strong> - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p><strong>2. test - </strong>Duis turpis lorem, blandit in ante ac, feugiat dictum.&nbsp;</p><p><strong>3. test</strong> - Nulla ornare mauris viverra nisi ultrices iaculis. Maecenas egestas ultricies elit.</p>",
    ingredientGroups: [
      {
        name: "",
        ingredients: [
          { amount: { numerator: 1, denominator: 1 }, unit: "", name: "bread rolls", note: "" },
          { amount: { numerator: 3, denominator: 2 }, unit: "tbsp", name: "green cabbage", note: "" },
          { amount: { numerator: 1, denominator: 3 }, unit: "tbsp", name: "chicken mince", note: "" },
          { amount: { numerator: 6, denominator: 1 }, unit: "", name: "green onion stems", note: "cut into the length of the rolls" },
          { amount: { numerator: 5, denominator: 2 }, unit: "slices", name: "test", note: "" },
          { amount: { numerator: 3, denominator: 5 }, unit: "slices", name: "roast pork", note: "" },
          { amount: { numerator: 1, denominator: 1 }, unit: "", name: "cucumbers", note: "finely sliced" },
          { amount: { numerator: 1, denominator: 1 }, unit: "", name: "chillies", note: "finely sliced" },
        ],
      },
      {
        name: "Pickled pickles",
        ingredients: [
          { amount: { numerator: 1, denominator: 1 }, unit: "", name: "carrots", note: 'peeled, cut into 2-3mm / 1/10" batons' },
          { amount: { numerator: 200, denominator: 1 }, unit: "ml", name: "hot water", note: "" },
          { amount: { numerator: 50, denominator: 1 }, unit: "g", name: "sugar", note: "" },
          { amount: { numerator: 4, denominator: 1 }, unit: "tsp", name: "salt", note: "" },
          { amount: { numerator: 100, denominator: 1 }, unit: "ml", name: "rice vinegar", note: "" },
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
    cookingDuration: { name: "Cooking", minutes: 10, hours: 1, days: 1 },
    customDurations: [{ name: "pickling", minutes: 0, hours: 1, days: 0 }],
    tags: ["easy", "lunch", "quick"],
    slug: Math.floor(Math.random() * 1000).toString(),
  };
  await axios.post(apis.recipes, recipe);
}
</script>
