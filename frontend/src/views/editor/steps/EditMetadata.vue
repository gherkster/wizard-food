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
          :value="recipeStore.category"
          :options="categories"
          :errors="v$.category.$errors"
          @input="handleInput"
          @blur="handleBlur"
        />
      </x-column>
      <x-column col-6 col-md-3>
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
      </x-column>
    </x-row>
    <x-row>
      <x-column col-6 col-md-2>
        <x-input
          path="servings"
          label="No. of servings"
          input-mode="numeric"
          :value="recipeStore.servings"
          :errors="v$.servings.$errors"
          @input="handleInput"
          @blur="handleBlur"
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
          :value="recipeStore.tags"
          :options="tags"
          @input="handleInput"
          @blur="handleBlur"
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
          :value="recipeStore.slug"
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

<script>
import { useRecipeStore } from "@/store/recipeStore";
import { useVuelidate } from "@vuelidate/core";
import { XSelect, XInput, XRow, XColumn, XIcon } from "@/components";
import { NButton, NForm } from "naive-ui";
import apis from "@/constants/apis";
import { helpers, minValue, numeric, required } from "@vuelidate/validators";
import { slugPattern } from "@/scripts/validation";
import { useAxios } from "@/composables";
import { ref } from "vue";

export default {
  name: "EditMetadata",
  components: {
    XInput,
    XSelect,
    NButton,
    NForm,
    XRow,
    XColumn,
    XIcon,
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
          (value) => value.match(slugPattern)
        ),
        $autoDirty: true,
      },
    };
    return {
      recipeStore,
      axios,
      externalResults,
      v$: useVuelidate(validationRules, recipeStore, { $externalResults: externalResults }),
    };
  },
  data() {
    return {
      isSlugGenerating: false,
    };
  },
  created() {
    // We know that if the user is editing an existing recipe that the slug is unique on component load
    if (!this.isEditingExistingRecipe) {
      this.recipeStore.slug = this.createSlugFromTitle();
      this.validateSlugIsUnique();
    }
  },
  computed: {
    slugButtonType() {
      return this.v$.slug.$errors.length > 0 ? "error" : "primary";
    },
    slugButtonIcon() {
      return this.v$.slug.$silentErrors.length > 0 ? "fa-arrow-rotate-right" : "fa-check";
    },
    isEditingExistingRecipe() {
      return !!this.$route.params.slug;
    },
  },
  methods: {
    handleInput({ path, value }) {
      this.recipeStore.setValueAt(path, value);
      if (this.v$[path]) {
        this.v$[path].$touch();
      }
    },
    handleBlur({ path, value }) {
      this.recipeStore.setValueAt(path, value);
      if (this.v$[path]) {
        this.v$[path].$touch();
      }
    },
    onSlugInput({ path, value }) {
      // Replace spaces with hyphens to encourage valid slug to be entered
      value = value.replaceAll(" ", "-");
      this.handleInput({ path, value });
    },
    onSlugBlur({ path }) {
      this.handleBlur({ path });
      // Only validate uniqueness if the slug is already a valid string to cut down on API calls
      if (this.recipeStore.slug) {
        this.validateSlugIsUnique();
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
    async validateSlugIsUnique() {
      const nonUniqueSlugErrorMessage = "Slug already exists. Enter a unique value or click the reload icon to generate one.";
      if (!this.recipeStore.slug) {
        return;
      }
      let isValidSlug = false;
      this.isSlugGenerating = true;
      try {
        const response = await this.axios.get(apis.recipeSlugs, {
          params: {
            chosenSlug: this.recipeStore.slug,
          },
        });
        // If the api suggests a different slug to the entered one then the entered one is invalid since it is already in use
        // If we are currently editing a recipe and the entered slug is the same as the existing one
        // (ie if the user triggers the field validation without changing the value) then the slug is also valid
        isValidSlug = response.data === this.recipeStore.slug || this.recipeStore.slug === this.$route.params.slug;
        console.log(isValidSlug); // TODO: Remove
        if (isValidSlug) {
          this.v$.$clearExternalResults();
        } else {
          const errors = {
            slug: [nonUniqueSlugErrorMessage],
          };
          console.log(this.externalResults);
          Object.assign(this.externalResults, errors);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.isSlugGenerating = false;
      }
    },
  },
};
</script>
