<template>
  <n-form size="large">
    <x-select
      path="category"
      label="Category"
      filterable
      required
      tag
      :value="recipeStore.category"
      :options="categories"
      :errors="v$.category.$errors"
      @input="handleInput"
      @blur="handleBlur"
    />
    <x-select
      path="cuisine"
      label="Cuisine"
      filterable
      required
      tag
      :value="recipeStore.cuisine"
      :options="cuisines"
      :errors="v$.cuisine.$errors"
      @input="handleInput"
      @blur="handleBlur"
    />
    <x-input
      path="servings"
      label="No. of servings"
      :value="recipeStore.servings"
      :errors="v$.servings.$errors"
      @input="handleInput"
      @blur="handleBlur"
    />
    <x-select
      path="tags"
      label="Tags"
      filterable
      tag
      multiple
      :value="recipeStore.tags"
      :options="tags"
      @input="handleInput"
      @blur="handleBlur"
    />
    <x-input
      path="slug"
      label="URL Slug"
      :prefix="recipeUrlPrefix"
      :value="recipeStore.slug"
      :errors="v$.slug.$errors"
      @input="handleInput"
      @blur="handleBlur"
    >
      <template v-slot:suffix>
        <n-button type="primary" ghost :loading="isSlugGenerating" @click="createSlug">Generate</n-button>
      </template>
    </x-input>
  </n-form>
</template>

<script>
import { useRecipeStore } from "@/store/recipeStore";
import { useVuelidate } from "@vuelidate/core";
import { XSelect, XInput } from "@/components";
import { NButton, NForm } from "naive-ui";
import apis from "@/constants/apis";
import { helpers, minValue, numeric, required } from "@vuelidate/validators";
import { slugPattern } from "@/scripts/validation";
import { useAxios } from "@/composables";

export default {
  name: "EditorMetadata",
  components: {
    XInput,
    XSelect,
    NButton,
    NForm,
  },
  props: {
    categories: {
      type: Array,
      required: true,
    },
    cuisines: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const recipeStore = useRecipeStore();
    const axios = useAxios();
    async function validateSlug(slug) {
      let isValidSlug;
      await axios
        .get(apis.recipeSlugs, {
          params: {
            chosenSlug: slug,
          },
        })
        .then((response) => {
          // If the api suggests a different slug to the entered one then the entered one is invalid since it is already in use
          // If we are currently editing a recipe and the entered slug is the same as the existing one
          // (ie if the user triggers the field validation without changing the value) then the slug is also valid
          isValidSlug = response.data === slug || slug === this.$route.params.slug;
        })
        .catch((error) => console.log(error));

      return isValidSlug;
    }

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
          (value) => value.match(slugPattern)
        ),
        slugUnique: helpers.withMessage(
          "Slug already exists. Enter a unique value or click the reload icon to generate one.",
          async (value) => await validateSlug(value.trim())
        ),
      },
    };
    return {
      recipeStore,
      axios,
      v$: useVuelidate(validationRules, recipeStore),
    };
  },
  data() {
    return {
      isSlugGenerating: false,
    };
  },
  computed: {
    recipeUrlPrefix() {
      return window.location.host + "/recipes/";
    },
  },
  methods: {
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
    async createSlug() {
      this.isSlugGenerating = true;
      const chosenSlug = this.recipeStore.slug || this.createSlugFromTitle() || "recipe";
      await this.axios
        .get(apis.recipeSlugs, {
          params: {
            chosenSlug: chosenSlug,
          },
        })
        .then(async (response) => {
          if (response.data) {
            this.recipeStore.slug = response.data;
          }
        })
        .catch((error) => console.log(error))
        .finally(() => {
          console.log("done");
          this.isSlugGenerating = false;
        });
    },
    /**
     * Generate a slug based on the recipe title, replacing spaces with hyphens
     */
    createSlugFromTitle() {
      return this.recipeStore.title
        .toLowerCase()
        .trim()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
    },
  },
};
</script>
