<template>
  <v-row>
    <v-spacer />
    <v-col cols="12" sm="12" md="10" lg="8">
      <input-button label="Go to recipes" @click="goToRecipes" />
      <form>
        <div>
          <h2>New Recipe</h2>
          <!-- TODO: This should display the recipe name if the user is editing an existing recipe -->
          <v-row>
            <v-col>
              <text-field
                label="Recipe Title"
                path="header.title"
                :value="recipeStore.header.title"
                :error="errors.header.title"
                @input="handleTitleInput"
                @blur="handleBlur"
              />
            </v-col>
            <v-col>
              <v-file-input accept="image/*" label="Recipe Banner" />
              <!-- TODO setup v-model -->
            </v-col>
            <v-col>
              <rating :length="5" :value="recipeStore.header.rating" path="header.rating" @input="handleInput" />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <text-area
                label="Description"
                path="header.description"
                :value="recipeStore.header.description"
                @input="handleInput"
                @blur="handleBlur"
              />
            </v-col>
          </v-row>
        </div>
        <h2>Ingredients</h2>
        <v-row v-for="(item, index) in recipeStore.ingredients" :key="item.uuid">
          <!-- If item is a section name -->
          <v-col cols="11" v-if="item.itemType === 'section'">
            <text-field
              label="Section name"
              path="label"
              :value="item.label"
              :error="errors.ingredients[index] ? errors.ingredients[index].label : ''"
              @input="handleIngredientInputAtIndex($event, index)"
              @blur="handleIngredientBlurAtIndex($event, index)"
            />
          </v-col>
          <!-- If item is an ingredient -->
          <template v-else>
            <v-col cols="2">
              <text-field
                label="Amount"
                path="amount"
                :value="item.amount"
                :error="errors.ingredients[index] ? errors.ingredients[index].amount : ''"
                @input="handleIngredientInputAtIndex($event, index)"
                @blur="handleIngredientBlurAtIndex($event, index)"
              />
            </v-col>
            <v-col cols="2">
              <combo-box
                label="Units"
                path="unit"
                :value="item.unit"
                :items="['g', 'ml']"
                :error="errors.ingredients[index] ? errors.ingredients[index].unit : ''"
                @input="handleIngredientInputAtIndex($event, index)"
                @blur="handleIngredientBlurAtIndex($event, index)"
              />
            </v-col>
            <v-col cols="4">
              <text-field
                label="Ingredient"
                path="label"
                :value="item.label"
                :error="errors.ingredients[index] ? errors.ingredients[index].label : ''"
                @input="handleIngredientInputAtIndex($event, index)"
                @blur="handleIngredientBlurAtIndex($event, index)"
              />
            </v-col>
            <v-col cols="3">
              <text-field label="Notes" path="note" :value="item.note" @input="handleIngredientInputAtIndex($event, index)" />
            </v-col>
          </template>
          <v-col cols="1">
            <icon fa-icon="fa-xmark" hover @click="removeIngredientAt(index)" />
          </v-col>
        </v-row>
        <v-row justify="space-around">
          <input-button label="Add Group" @click="addIngredientGroup" />
          <input-button label="Add Ingredient" @click="addIngredient" />
        </v-row>
        <h2>Instructions</h2>
        <v-row v-for="(item, index) in recipeStore.instructions" :key="item.uuid">
          <!-- If item is a section name -->
          <v-col cols="11" v-if="item.itemType === 'section'">
            <text-field
              label="Section name"
              path="label"
              :value="item.label"
              :error="errors.instructions[index] ? errors.instructions[index].label : ''"
              @input="handleInstructionInputAtIndex($event, index)"
              @blur="handleInstructionBlurAtIndex($event, index)"
            />
          </v-col>
          <!-- If item is an instruction -->
          <v-col v-else cols="11">
            <text-field
              label="Instruction"
              path="label"
              :value="item.label"
              :error="errors.instructions[index] ? errors.instructions[index].label : ''"
              @input="handleInstructionInputAtIndex($event, index)"
              @blur="handleInstructionBlurAtIndex($event, index)"
            />
          </v-col>
          <v-col cols="1">
            <icon fa-icon="fa-xmark" hover @click="removeInstructionAt(index)" />
          </v-col>
        </v-row>
        <v-row justify="space-around">
          <input-button label="Add Group" @click="addInstructionGroup" />
          <input-button label="Add Ingredient" @click="addInstruction" />
        </v-row>
        <!-- Metadata -->
        <h2>Metadata</h2>
        <v-row>
          <v-col>
            <text-field
              label="Servings"
              path="servings"
              :value="recipeStore.servings"
              :error="errors.servings"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <combo-box
              label="Serving Type"
              path="servingType"
              :value="recipeStore.servingType"
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
              :value="recipeStore.category"
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
              :value="recipeStore.cuisine"
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
              :value="recipeStore.preparationTime.minutes"
              :error="errors.preparationTime.minutes"
              @input="handleInput"
              @blur="handleBlur"
            />
            <text-field
              label="Hours"
              path="preparationTime.hours"
              :value="recipeStore.preparationTime.hours"
              :error="errors.preparationTime.hours"
              @input="handleInput"
              @blur="handleBlur"
            />
            <text-field
              label="Days"
              path="preparationTime.days"
              :value="recipeStore.preparationTime.days"
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
              :value="recipeStore.cookingTime.minutes"
              :error="errors.cookingTime.minutes"
              @input="handleInput"
              @blur="handleBlur"
            />
            <text-field
              label="Hours"
              path="cookingTime.hours"
              :value="recipeStore.cookingTime.hours"
              :error="errors.cookingTime.hours"
              @input="handleInput"
              @blur="handleBlur"
            />
            <text-field
              label="Days"
              path="cookingTime.days"
              :value="recipeStore.cookingTime.days"
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
              :value="recipeStore.customTime.minutes"
              :error="errors.customTime.minutes"
              @input="handleInput"
              @blur="handleBlur"
            />
            <text-field
              label="Hours"
              path="customTime.hours"
              :value="recipeStore.customTime.hours"
              :error="errors.customTime.hours"
              @input="handleInput"
              @blur="handleBlur"
            />
            <text-field
              label="Days"
              path="customTime.days"
              :value="recipeStore.customTime.days"
              :error="errors.customTime.days"
              @input="handleInput"
              @blur="handleBlur"
            />
            <combo-box
              label="Type"
              path="customTimeType"
              :value="recipeStore.customTimeType"
              :items="customTimeTypes"
              :error="errors.customTimeType"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <chip-box label="Tags" path="tags" :value="new Set(recipeStore.tags)" :items="tags" @input="handleInput" @blur="handleBlur" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <text-field
              label="Slug"
              path="slug"
              prefix="/"
              :value="recipeStore.slug"
              :suffix-icon="!errors.slug ? 'fa-check' : 'fa-arrow-rotate-right'"
              :suffix-icon-disabled="!errors.slug"
              :error="errors.slug"
              @input="handleSlugInput"
              @blur="handleBlur"
              @clickIcon="createSlug"
            />
          </v-col>
        </v-row>
        <!-- Nutrition -->
        <h2>Nutrition</h2>
        <v-row>
          <v-col>
            <text-field
              label="Energy"
              path="nutrition.energy"
              :value="recipeStore.nutrition.energy"
              :error="errors.nutrition.energy"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <text-field
              label="Protein"
              path="nutrition.protein"
              :value="recipeStore.nutrition.protein"
              :error="errors.nutrition.protein"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <text-field
              label="Carbs"
              path="nutrition.carbohydrates"
              :value="recipeStore.nutrition.carbohydrates"
              :error="errors.nutrition.carbohydrates"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <text-field
              label="Fat"
              path="nutrition.fat"
              :value="recipeStore.nutrition.fat"
              :error="errors.nutrition.fat"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
          <v-col>
            <text-field
              label="Sodium"
              path="nutrition.sodium"
              :value="recipeStore.nutrition.sodium"
              :errors="errors.nutrition.sodium"
              @input="handleInput"
              @blur="handleBlur"
            />
          </v-col>
        </v-row>
        <input-button label="Submit" :loading="isSubmitting" @click="submit" />
      </form>
    </v-col>
    <v-spacer />
  </v-row>
</template>

<script>
import axios from "axios";
import { getFormInitialErrorState, slugPattern } from "@/scripts/validation";
import { mapRecipeToApi } from "@/scripts/mapping";
import { useRecipeStore } from "@/store/recipeStore";
import TextArea from "@/components/molecules/TextArea";
import TextField from "@/components/molecules/TextField";
import ComboBox from "@/components/molecules/ComboBox";
import { object, string, number, array, ValidationError } from "yup";
import { get, set, setWith } from "lodash";
import { IntegerMessage, NumericMessage, PositiveMessage, RequiredMessage } from "@/constants/validationMessages";
import ChipBox from "@/components/molecules/ChipBox";
import { useAlertStore } from "@/store/alertStore";
import Rating from "@/components/molecules/Rating";
import Icon from "@/components/atoms/Icon";
import InputButton from "@/components/molecules/InputButton";
import { uuid } from "vue-uuid";

export default {
  name: "Editor",
  components: { Rating, ChipBox, TextArea, TextField, ComboBox, Icon, InputButton },
  setup() {
    const recipeStore = useRecipeStore();
    const alertStore = useAlertStore();
    return {
      recipeStore: recipeStore,
      alertStore: alertStore,
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
    isSubmitting: false,
    errors: getFormInitialErrorState(),
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
          this.recipeStore.servingType = "servings";
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
            otherwise: (schema) => schema.label("Section name").trim().required(RequiredMessage),
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
      slug: string() // TODO: Add api validation of slug with slugs endpoint
        .label("Slug")
        .required(RequiredMessage)
        .matches(
          slugPattern,
          "URL slug must be a unique combination of alphanumeric characters and hyphens, such as my-new-form or MyNewRecipe"
        )
        .test(
          "is-slug-unique",
          "Slug already exists. Enter a unique value or click the reload icon to generate one.",
          async (value, testContext) => {
            // Skip API validation of unique slug when user is still entering text.
            // This ensures there is no latency/overuse of endpoint and text regex can run,
            // while still validating when the blur event fires.
            if (!testContext.options.skipApiValidation && value.trim()) {
              return await this.validateSlug(value.trim());
            } else {
              return true;
            }
          }
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
      this.recipeStore.setValueAt(event.path, event.value);
      await this.validateAt(event.path);
    },
    /**
     * Handle title input while also prefilling a potential URL slug
     */
    async handleTitleInput(event) {
      await this.handleInput(event);
      await this.createSlugFromTitle();
    },
    /**
     * A separate input handler for slug input.
     * This avoids calling the validation endpoint for each keypress, and only validates on input blur.
     */
    async handleSlugInput(event) {
      this.recipeStore.setValueAt(event.path, event.value);
      await this.validateAt(event.path, true);
    },
    async handleIngredientInputAtIndex(event, index) {
      this.recipeStore.setValueAtIndex("ingredients", index, event.path, event.value);
      await this.validateAt(`ingredients[${index}].${event.path}`);
    },
    async handleInstructionInputAtIndex(event, index) {
      this.recipeStore.setValueAtIndex("instructions", index, event.path, event.value);
      await this.validateAt(`instructions[${index}].${event.path}`);
    },
    async handleBlur(event) {
      this.recipeStore.setValueAt(event.path, event.value);
      await this.validateAt(event.path);
    },
    async handleIngredientBlurAtIndex(event, index) {
      this.recipeStore.setValueAtIndex("ingredients", index, event.path, event.value);
      await this.validateAt(`ingredients[${index}].${event.path}`);
    },
    async handleInstructionBlurAtIndex(event, index) {
      this.recipeStore.setValueAtIndex("instructions", index, event.path, event.value);
      await this.validateAt(`instructions[${index}].${event.path}`);
    },
    addIngredientGroup() {
      this.addItemGroup("ingredients");
    },
    addInstructionGroup() {
      this.addItemGroup("instructions");
    },
    addIngredient() {
      this.addItem("ingredients", { label: "", amount: "", unit: "", note: "" });
    },
    addInstruction() {
      this.addItem("instructions", { label: "" });
    },
    addItemGroup(section) {
      if (this.recipeStore[section]) {
        this.recipeStore[section].push({
          uuid: uuid.v1(),
          itemType: "section",
          label: "",
        });
      }
    },
    addItem(section, fields) {
      if (this.recipeStore[section]) {
        this.recipeStore[section].push({
          uuid: uuid.v1(),
          itemType: "item",
          label: "",
          ...fields,
        });
      }
    },
    removeIngredientAt(index) {
      this.removeItemAt("ingredients", index);
    },
    removeInstructionAt(index) {
      this.removeItemAt("instructions", index);
    },
    removeItemAt(section, index) {
      if (this.recipeStore[section]) {
        this.recipeStore[section].splice(index, 1);
      }
      if (this.errors[section][index]) {
        this.errors[section].splice(index, 1);
      }
    },
    async validateAt(field, skipApiValidation = false) {
      console.log("validating: ", field, "with value: ", get(this.recipeStore, field));
      await this.validationSchema
        .validateAt(field, this.recipeStore, { abortEarly: false, skipApiValidation: skipApiValidation })
        .then(() => {
          // Set using setWith to ensure reactivity is maintained when updating array values
          setWith(this.errors, field, "", (nsValue, key, nsObject) => {
            return this.$set(nsObject, key, nsValue);
          });
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
              setWith(this.errors, e.path, e.message, (nsValue, key, nsObject) => {
                return this.$set(nsObject, key, nsValue);
              });
            });
          } else {
            console.log(error);
          }
        });

      // If one of the custom times is modified (minutes, hours, days), then validate the customTimeType.
      // This ensures the user sees the field is required as soon as one of the above fields is modified,
      // without needing to interact with the customTimeType field directly.
      if (field.includes("customTime.")) {
        await this.validateAt("customTimeType");
      }
    },
    async validateAll() {
      await this.validationSchema
        .validate(this.recipeStore, { abortEarly: false })
        .then(() => {
          this.errors = getFormInitialErrorState();
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
          }
        });
    },
    /**
     * Generate a slug based on the recipe title, replacing spaces with hyphens
     */
    async createSlugFromTitle() {
      this.recipeStore.slug = this.recipeStore.header.title
        .toLowerCase()
        .trim()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
      await this.validateAt("slug", true);
    },
    async validateSlug(slug) {
      let isValidSlug;
      await axios
        .get(process.env.VUE_APP_APIURL + "/api/recipes/slugs", {
          params: {
            chosenSlug: slug,
          },
        })
        .then((response) => {
          isValidSlug = response.data === slug;
        })
        .catch((error) => console.log(error));

      return isValidSlug;
    },
    async createSlug() {
      let chosenSlug = this.recipeStore.slug || (await this.createSlugFromTitle()) || "recipe";
      await axios
        .get(process.env.VUE_APP_APIURL + "/api/recipes/slugs", {
          params: {
            chosenSlug: chosenSlug,
          },
        })
        .then(async (response) => {
          if (response.data) {
            this.recipeStore.slug = response.data;
            await this.validateAt("slug");
          }
        })
        .catch((error) => console.log(error));
    },
    async submit() {
      await this.validateAll();
      if (this.errors) {
        this.alertStore.showErrorAlert("The form is invalid. Please check your entered data");
        return;
      }
      this.isSubmitting = true;
      console.log(JSON.stringify(this.recipeStore));
      await axios
        .post(process.env.VUE_APP_APIURL + "/api/recipes", mapRecipeToApi(this.recipeStore))
        .then(() => {
          this.alertStore.showSuccessAlert("Recipe created!");
        })
        .catch((error) => {
          this.alertStore.showErrorAlert("An error occurred while creating the form");
          console.log(error);
        })
        .finally(() => (this.isSubmitting = false));
    },
  },
};
</script>

<style scoped></style>
