<template>
  <v-row>
    <v-spacer />
    <v-col cols="12" sm="12" md="10" lg="8">
      <v-btn @click="goToRecipes">Go to recipes</v-btn>
      <v-form ref="editor">
        <div>
          <h2>New Recipe</h2>
          <!-- TODO: This should display the recipe name if the user is editing an existing recipe -->
          <v-row>
            <v-col>
              <text-field
                label="Recipe Title"
                path="header.title"
                :value="store.header.title"
                :error="errors.header.title"
                @input="handleInput"
                @blur="handleBlur"
              />
            </v-col>
            <v-col>
              <v-file-input accept="image/*" label="Recipe Banner" />
              <!-- TODO setup v-model -->
            </v-col>
            <v-col>
              <v-rating length="5" size="40" hover v-model="store.header.rating" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <text-area
                label="Description"
                path="header.description"
                :value="store.header.description"
                @input="handleInput"
                @blur="handleBlur"
              />
            </v-col>
          </v-row>
        </div>
        <h2>Ingredients</h2>
        <item-list
          :value="store.ingredients"
          :unit-items="['g', 'ml']"
          :errors="errors.ingredients"
          path="ingredients"
          item-label="Ingredient"
          has-amount
          has-units
          has-note
          @input="handleInput"
        />
        <h2>Instructions</h2>
        <item-list
          :value="store.instructions"
          :errors="errors.instructions"
          path="instructions"
          item-label="Instruction"
          @input="handleInput"
        />
        <!-- Metadata -->
        <h2>Metadata</h2>
        <v-row>
          <v-col>
            <text-field
              label="Servings"
              path="servings"
              :value="store.servings"
              :error="errors.servings"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <combo-box
              label="Serving Type"
              path="servingType"
              :value="store.servingType"
              :items="servingTypes"
              :error="errors.servingType"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <combo-box
              label="Category"
              path="category"
              :value="store.category"
              :items="categories"
              :error="errors.category"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <combo-box
              label="Cuisine"
              path="cuisine"
              :value="store.cuisine"
              :items="cuisines"
              :error="errors.cuisine"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <p>Preparation time</p>
            <text-field
              label="Minutes"
              path="preparationTime.minutes"
              :value="store.preparationTime.minutes"
              :error="errors.preparationTime.minutes"
              @input="handleInput"
              @blur="handleBlur"
            />
            <text-field
              label="Hours"
              path="preparationTime.hours"
              :value="store.preparationTime.hours"
              :error="errors.preparationTime.hours"
              @input="handleInput"
              @blur="handleBlur"
            />
            <text-field
              label="Days"
              path="preparationTime.days"
              :value="store.preparationTime.days"
              :error="errors.preparationTime.days"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <p>Cooking time</p>
            <text-field
              label="Minutes"
              path="cookingTime.minutes"
              :value="store.cookingTime.minutes"
              :error="errors.cookingTime.minutes"
              @input="handleInput"
              @blur="handleBlur"
            />
            <text-field
              label="Hours"
              path="cookingTime.hours"
              :value="store.cookingTime.hours"
              :error="errors.cookingTime.hours"
              @input="handleInput"
              @blur="handleBlur"
            />
            <text-field
              label="Days"
              path="cookingTime.days"
              :value="store.cookingTime.days"
              :error="errors.cookingTime.days"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <p>Custom time</p>
            <text-field
              label="Minutes"
              path="customTime.minutes"
              :value="store.customTime.minutes"
              :error="errors.customTime.minutes"
              @input="handleInput"
              @blur="handleBlur"
            />
            <text-field
              label="Hours"
              path="customTime.hours"
              :value="store.customTime.hours"
              :error="errors.customTime.hours"
              @input="handleInput"
              @blur="handleBlur"
            />
            <text-field
              label="Days"
              path="customTime.days"
              :value="store.customTime.days"
              :error="errors.customTime.days"
              @input="handleInput"
              @blur="handleBlur"
            />
            <combo-box
              label="Type"
              path="customTimeType"
              :value="store.customTimeType"
              :items="customTimeTypes"
              :error="errors.customTimeType"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-combobox label="Tags" chips multiple :items="tags" />
          <v-text-field
            label="Slug"
            prefix="/"
            v-model="store.slug"
            :rules="[rules.required('Slug'), rules.isSlug()]"
            :append-outer-icon="isSlugValid ? 'mdi-check' : 'mdi-reload'"
            @click:append-outer="createSlug"
            @input="isSlugValid = false"
          />
        </v-row>
        <!-- Nutrition -->
        <h2>Nutrition</h2>
        <v-row>
          <v-col>
            <text-field
              label="Energy"
              path="nutrition.energy"
              :value="store.nutrition.energy"
              :error="errors.nutrition.energy"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <text-field
              label="Protein"
              path="nutrition.protein"
              :value="store.nutrition.protein"
              :error="errors.nutrition.protein"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <text-field
              label="Carbs"
              path="nutrition.carbohydrates"
              :value="store.nutrition.carbohydrates"
              :error="errors.nutrition.carbohydrates"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <text-field
              label="Fat"
              path="nutrition.fat"
              :value="store.nutrition.fat"
              :error="errors.nutrition.fat"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <text-field
              label="Sodium"
              path="nutrition.sodium"
              :value="store.nutrition.sodium"
              :errors="errors.nutrition.sodium"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
        </v-row>
        <v-btn @click="submit" :loading="isSubmitting">Submit</v-btn>
      </v-form>
    </v-col>
    <v-spacer />
  </v-row>
</template>

<script>
import axios from "axios";
import ItemList from "@/components/organisms/ItemList";
import { isDecimal, isRequired, isSlug, slugPattern } from "@/scripts/validation";
import { eventBus } from "@/main";
import { AlertKeys, Severity } from "@/constants/enums";
import { mapRecipeToApi } from "@/scripts/mapping";
import { useRecipeStore } from "@/store/recipeStore";
import TextArea from "@/components/molecules/TextArea";
import TextField from "@/components/molecules/TextField";
import ComboBox from "@/components/molecules/ComboBox";
import { object, string, number, array, ValidationError } from "yup";
import { get, set } from "lodash";
import { IntegerMessage, NumericMessage, PositiveMessage, RequiredMessage } from "@/constants/validationMessages";

export default {
  name: "Editor",
  components: { TextArea, TextField, ItemList, ComboBox },
  setup() {
    const store = useRecipeStore();
    return {
      store,
    };
  },
  data: () => ({
    validationSchema: null,
    timeOptions: ["minutes", "hours", "days"],
    customTimeTypes: [],
    servingTypes: [],
    categories: [],
    cuisines: [],
    tags: [],
    isSlugValid: false,
    isSubmitting: false,
    errors: {
      header: {
        title: "",
      },
      ingredients: [],
      instructions: [],
      servings: "",
      servingType: "",
      category: "",
      cuisine: "",
      preparationTime: {
        minutes: "",
        hours: "",
        days: "",
      },
      cookingTime: {
        minutes: "",
        hours: "",
        days: "",
      },
      customTime: {
        minutes: "",
        hours: "",
        days: "",
      },
      customTimeType: "",
      nutrition: {
        energy: "",
        protein: "",
        carbohydrates: "",
        fat: "",
        sodium: "",
      },
      slug: "",
    },
    rules: {
      required(labelName) {
        return (value) => isRequired(value, `${labelName} is required`);
      },
      isDecimal(labelName) {
        return (value) => isDecimal(value, `${labelName} must be a number`);
      },
      isSlug() {
        return (slug) => isSlug(slug, "URL slug must only contain alphanumeric characters and hyphens, such as my-new-form or MyNewRecipe");
      },
    },
  }),
  async created() {
    await axios
      .get(process.env.VUE_APP_APIURL + "/api/recipes/editor/dropdown-options")
      .then((response) => {
        this.categories = response.data.categories.map((c) => c.label);
        this.cuisines = response.data.cuisines.map((c) => c.label);
        this.customTimeTypes = response.data.customTimeTypes.map((ct) => ct.label);
        this.servingTypes = response.data.servingTypes.map((st) => st.label);
        this.tags = response.data.tags.map((t) => t.label);

        // Default to servings if it's a valid option
        if (this.servingTypes.includes("servings")) {
          this.store.servingType = "servings";
        }
      })
      .catch((error) => console.log(error));

    /**
     * Form validation transformation function used with number() fields to convert empty strings to undefined.
     * This is to avoid empty strings being considered an invalid number
     * @returns {undefined|*}
     */
    function emptyToUndefined(currentValue, originalValue) {
      return originalValue === "" ? undefined : currentValue;
    }

    // Form validation schema
    this.validationSchema = object().shape({
      header: object().shape({
        title: string().label("Title").trim().required(RequiredMessage),
        rating: number(),
        description: string(),
      }),
      ingredients: array().of(
        object({
          amount: number()
            .transform(emptyToUndefined)
            .when("itemType", {
              is: "item",
              then: (schema) => schema.label("Amount").required(RequiredMessage).typeError(NumericMessage).min(0, PositiveMessage),
            }),
          unit: string().when("itemType", {
            is: "item",
            then: (schema) => schema.label("Unit").trim().required(RequiredMessage),
          }),
          label: string().when("itemType", {
            is: "item",
            then: (schema) => schema.label("Ingredient").trim().required(RequiredMessage),
            otherwise: (schema) => schema.label("Section name").trim().required(RequiredMessage),
          }),
        })
      ),
      instructions: array().of(
        object().shape({
          label: string().when("itemType", {
            is: "item",
            then: (schema) => schema.label("Instruction").trim().required(RequiredMessage),
            otherwise: (schema) => schema.label("Section name").trim().required(RequiredMessage)
          }),
        })
      ),
      servings: number()
        .label("Servings")
        .transform(emptyToUndefined)
        .required(RequiredMessage)
        .typeError(NumericMessage)
        .min(0, PositiveMessage),
      servingType: string().label("Serving type").trim().required(RequiredMessage),
      category: string().label("Category").trim().required(RequiredMessage),
      cuisine: string().label("Cuisine").trim().required(RequiredMessage),
      preparationTime: object().shape({
        minutes: number().label("Minutes").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
        hours: number().label("Hours").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
        days: number().label("Days").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
      }),
      cookingTime: object().shape({
        minutes: number().label("Minutes").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
        hours: number().label("Hours").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
        days: number().label("Days").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
      }),
      customTime: object().shape({
        minutes: number().label("Minutes").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
        hours: number().label("Hours").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
        days: number().label("Days").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
      }),
      customTimeType: string().when("customTime", {
        is: (ct) => ct.minutes || ct.hours || ct.days,
        then: (schema) => schema.label("Custom time type").trim().required(RequiredMessage),
      }),
      slug: string()
        .label("Slug")
        .trim()
        .required(RequiredMessage)
        .matches(
          slugPattern,
          "URL slug must be a unique combination of alphanumeric characters and hyphens, such as my-new-form or MyNewRecipe"
        ),
      nutrition: object().shape({
        energy: number().label("Energy").transform(emptyToUndefined).typeError(NumericMessage),
        protein: number().label("Protein").transform(emptyToUndefined).typeError(NumericMessage),
        carbohydrates: number().label("Carbs").transform(emptyToUndefined).typeError(NumericMessage),
        fat: number().label("Fat").transform(emptyToUndefined).typeError(NumericMessage),
        sodium: number().label("Sodium").transform(emptyToUndefined).typeError(NumericMessage),
      }),
      tags: array(),
    });
  },
  methods: {
    goToRecipes() {
      this.$router.push("/");
    },
    async handleInput(event) {
      this.store.setValueAt(event.path, event.value);
      await this.validate(event.path);
    },
    async handleBlur(event) {
      this.store.setValueAt(event.path, event.value);
      await this.validate(event.path);
    },
    async validate(field) {
      console.log("validating: ", field, "with value: ", get(this.store, field));
      await this.validationSchema
        .validateAt(field, this.store, { abortEarly: false })
        .then(() => {
          set(this.errors, field, "");
        })
        .catch((error) => {
          if (error instanceof ValidationError) {
            let validationErrors = error.inner.map((e) => ({ path: e.params.path.toString(), message: e.message }));

            // If errors are an array clear them out first, as we are setting specific properties
            // within the array which would hang around otherwise
            if (Array.isArray(get(this.errors, error.path))) {
              set(this.errors, error.path, []);
            }

            validationErrors.forEach((e) => {
              set(this.errors, e.path, e.message);
            });
          } else {
            console.log(error);
          }
        });

      // If one of the custom times is modified (minutes, hours, days), then validate the customTimeType.
      // This ensures the user sees the field is required as soon as one of the above fields is modified,
      // without needing to interact with the customTimeType field directly.
      if (field.includes("customTime.")) {
        await this.validate("customTimeType");
      }
    },
    updateSlug() {
      this.store.slug = this.store.title
        .toLowerCase()
        .trim()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
    },
    async createSlug() {
      let chosenSlug = this.store.slug || "recipe";
      await axios
        .get(process.env.VUE_APP_APIURL + "/api/recipes/slugs", {
          params: {
            chosenSlug: chosenSlug,
          },
        })
        .then((response) => {
          if (chosenSlug !== response.data) {
            eventBus.$emit(AlertKeys.ADD, Severity.INFO, "The entered slug is already in use, a unique slug has been provided");
          }
          this.store.slug = response.data;
          this.isSlugValid = true;
        })
        .catch((error) => console.log(error));
    },
    async submit() {
      if (!this.$refs.editor.validate()) {
        eventBus.$emit(AlertKeys.ADD, Severity.ERROR, "The form is invalid. Please check your entered data");
        return;
      }
      this.isSubmitting = true;
      console.log(JSON.stringify(this.store));
      await axios
        .post(process.env.VUE_APP_APIURL + "/api/recipes", mapRecipeToApi(this.store))
        .then(() => {
          eventBus.$emit(AlertKeys.ADD, Severity.SUCCESS, "Recipe created");
        })
        .catch((error) => {
          eventBus.$emit(AlertKeys.ADD, Severity.ERROR, "An error occurred while creating the form");
          console.log(error);
        })
        .finally(() => (this.isSubmitting = false));
    },
  },
};
</script>

<style scoped></style>
