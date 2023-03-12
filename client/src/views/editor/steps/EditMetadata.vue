<template>
  <n-form size="large">
    <x-row>
      <x-column col-6 col-md-3>
        <x-select
          path="category"
          label="Category"
          filterable
          required
          tag
          :value="recipeStore.recipe.category"
          :options="props.categories"
          :errors="v$.category.$errors"
          @input="onCategoryInput"
          @blur="v$.category.$touch()"
        />
      </x-column>
      <x-column col-6 col-md-3>
        <x-select
          path="cuisine"
          label="Cuisine"
          filterable
          required
          tag
          :value="recipeStore.recipe.cuisine"
          :options="props.cuisines"
          :errors="v$.cuisine.$errors"
          @input="onCuisineInput"
          @blur="v$.cuisine.$touch()"
        />
      </x-column>
    </x-row>
    <x-row>
      <x-column col-6 col-md-2>
        <x-input
          path="servings"
          label="No. of servings"
          input-mode="numeric"
          :value="recipeStore.recipe.servings"
          :errors="v$.servings.$errors"
          @input="onServingsInput"
          @blur="v$.servings.$touch()"
        />
      </x-column>
    </x-row>
    <x-row>
      <x-column col-12 col-md-6>
        <x-select
          path="tags"
          label="Tags"
          filterable
          tag
          multiple
          :value="recipeStore.recipe.tags"
          :options="props.tags"
          @input="onTagsInput"
          @blur="onTagsInput"
        />
      </x-column>
    </x-row>
    <x-row>
      <x-column col-12 col-md-6>
        <x-input
          path="slug"
          label="URL Slug"
          prefix="/recipes/"
          input-mode="url"
          :value="recipeStore.recipe.slug"
          :errors="v$.slug.$errors"
          @input="onSlugInput"
          @blur="onSlugBlur"
        >
          <template v-slot:suffix>
            <n-button :type="slugButtonType" ghost @click="createSlug">
              <x-icon :spin="isSlugGenerating" :fa-icon="slugButtonIcon" />
            </n-button>
          </template>
        </x-input>
      </x-column>
    </x-row>
  </n-form>
</template>

<script setup lang="ts">
import { useRecipeStore } from "@/store/recipeStore";
import { useVuelidate } from "@vuelidate/core";
import { XSelect, XInput, XRow, XColumn, XIcon } from "@/components";
import { NButton, NForm } from "naive-ui";
import apis from "@/constants/apis";
import { helpers, minValue, numeric, required } from "@vuelidate/validators";
import { slugPattern } from "@/scripts/validation";
import { useAxios } from "@/composables";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { ValueLabelPair } from "@/types/form";

const props = defineProps<{
  categories: Array<ValueLabelPair>;
  cuisines: Array<ValueLabelPair>;
  tags: Array<ValueLabelPair>;
}>();

const recipeStore = useRecipeStore();
const { recipe } = storeToRefs(recipeStore);
const axios = useAxios();
const route = useRoute();

const externalResults = ref({});
const validationRules = {
  category: {
    required,
  },
  cuisine: {
    required,
  },
  servings: {
    numeric,
    minValue: minValue(1),
  },
  slug: {
    required,
    slugPattern: helpers.withMessage(
      "URL slug must be a unique combination of alphanumeric characters and hyphens, such as my-new-recipe or MyNewRecipe",
      (value: string) => slugPattern.test(value)
    ),
    $autoDirty: true,
  },
};

const v$ = useVuelidate(validationRules, recipe, { $externalResults: externalResults });

const isSlugGenerating = ref(false);

const slugButtonType = computed(() => {
  return v$.value.slug.$errors.length > 0 ? "error" : "primary";
});

const slugButtonIcon = computed(() => {
  return v$.value.slug.$silentErrors.length > 0 ? "fa-arrow-rotate-right" : "fa-check";
});

const isEditingExistingRecipe = computed(() => {
  return !!route.params.slug;
});
// We know that if the user is editing an existing recipe that the slug is unique on component load
if (!isEditingExistingRecipe.value) {
  recipeStore.recipe.slug = createSlugFromTitle();
  validateSlugIsUnique();
}

function onCuisineInput(value: string) {
  recipeStore.recipe.cuisine = value;
  v$.value.cuisine.$touch();
}
function onCategoryInput(value: string) {
  recipeStore.recipe.category = value;
  v$.value.category.$touch();
}
function onServingsInput(value: number) {
  recipeStore.recipe.servings = value;
  v$.value.servings.$touch();
}
function onTagsInput(value: Array<string>) {
  recipeStore.recipe.tags = value;
}
function onSlugInput(value: string) {
  // Replace spaces with hyphens to encourage valid slug to be entered
  value = value.replaceAll(" ", "-");
  recipeStore.recipe.slug = value;
  v$.value.slug.$touch();
}

async function onSlugBlur() {
  // Only validate uniqueness if the slug is already a valid string to cut down on API calls
  if (recipeStore.recipe.slug) {
    await validateSlugIsUnique();
  }
}

async function createSlug() {
  isSlugGenerating.value = true;
  const chosenSlug = recipeStore.recipe.slug || createSlugFromTitle() || "recipe";
  await axios
    .get<string>(apis.recipeSlugs, {
      params: {
        chosenSlug: chosenSlug,
      },
    })
    .then(async (response) => {
      if (response.data) {
        recipeStore.recipe.slug = response.data;
      }
    })
    .catch((error) => console.log(error))
    .finally(() => {
      isSlugGenerating.value = false;
    });
}

/**
 * Generate a slug based on the recipe title, replacing spaces with hyphens
 */
function createSlugFromTitle() {
  return recipeStore.recipe.title
    .toLowerCase()
    .trim()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

async function validateSlugIsUnique() {
  const nonUniqueSlugErrorMessage = "Slug already exists. Enter a unique value or click the reload icon to generate one.";
  if (!recipeStore.recipe.slug) {
    return;
  }
  let isValidSlug = false;
  isSlugGenerating.value = true;
  try {
    const response = await axios.get(apis.recipeSlugs, {
      params: {
        chosenSlug: recipeStore.recipe.slug,
      },
    });
    // If the api suggests a different slug to the entered one then the entered one is invalid since it is already in use
    // If we are currently editing a recipe and the entered slug is the same as the existing one
    // (ie if the user triggers the field validation without changing the value) then the slug is also valid
    isValidSlug = response.data === recipeStore.recipe.slug || recipeStore.recipe.slug === route.params.slug;
    if (isValidSlug) {
      v$.value.$clearExternalResults();
    } else {
      const errors = {
        slug: [nonUniqueSlugErrorMessage],
      };
      Object.assign(externalResults.value, errors);
    }
  } catch (error) {
    console.log(error);
  } finally {
    isSlugGenerating.value = false;
  }
}
</script>
