<template>
  <div>
    <p>Recipe Editor</p>
    <v-btn @click="goToRecipes">Go to recipes</v-btn>
    <v-form ref="editor">
      <v-row>
        <v-col>
          <v-text-field label="Recipe Title" v-model="model.title" @input="updateSlug" :rules="[rules.required('Title')]" />
        </v-col>
        <v-col>
          <v-file-input accept="image/*" label="Recipe Banner" />
          <!-- TODO setup v-model -->
        </v-col>
      </v-row>
      <h2>Ingredients</h2>
      <item-list v-model="model.ingredients" item-label="Ingredient" has-amount has-units has-note />
      <h2>Instructions</h2>
      <item-list v-model="model.instructions" item-label="Instruction" />
      <!-- Metadata -->
      <h2>Metadata</h2>
      <v-row>
        <v-col>
          <v-text-field label="Servings" v-model="model.servings" :rules="[rules.required('Servings'), rules.isDecimal('Servings')]" />
        </v-col>
        <v-col>
          <v-combobox label="Serving Type" v-model="model.servingType" :items="servingTypes" :rules="[rules.required('Serving Type')]" />
        </v-col>
        <v-col>
          <v-combobox label="Category" v-model="model.category" :items="categories" :rules="[rules.required('Category')]" />
        </v-col>
        <v-col>
          <v-combobox label="Cuisine" v-model="model.cuisine" :items="cuisines" :rules="[rules.required('Cuisine')]" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p>Preparation time</p>
          <v-text-field label="Minutes" v-model="model.preparationTimeMinutes" :rules="[rules.isInteger('Minutes')]" />
          <v-text-field label="Hours" v-model="model.preparationTimeHours" :rules="[rules.isInteger('Hours')]" />
          <v-text-field label="Days" v-model="model.preparationTimeDays" :rules="[rules.isInteger('Days')]" />
        </v-col>
        <v-col>
          <p>Cooking time</p>
          <v-text-field label="Minutes" v-model="model.cookingTimeMinutes" :rules="[rules.isInteger('Minutes')]" />
          <v-text-field label="Hours" v-model="model.cookingTimeHours" :rules="[rules.isInteger('Hours')]" />
          <v-text-field label="Days" v-model="model.cookingTimeDays" :rules="[rules.isInteger('Days')]" />
        </v-col>
        <v-col>
          <p>Custom time</p>
          <v-text-field label="Minutes" v-model="model.customTimeMinutes" :rules="[rules.isInteger('Minutes')]" />
          <v-text-field label="Hours" v-model="model.customTimeHours" :rules="[rules.isInteger('Hours')]" />
          <v-text-field label="Days" v-model="model.customTimeDays" :rules="[rules.isInteger('Days')]" />
          <v-combobox
            label="Type"
            v-model="model.customTimeType"
            :items="customTimeTypes"
            :rules="[
              rules.customTimeTypeRequired(model.customTimeType, model.customTimeMinutes, model.customTimeHours, model.customTimeDays),
            ]"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-combobox label="Tags" chips multiple v-model="model.tags" :items="tags" />
        <v-text-field
          label="Slug"
          prefix="/"
          v-model="model.slug"
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
          <v-text-field label="Energy" v-model="model.nutrition.energy" :rules="[rules.isDecimal('Energy')]" />
        </v-col>
        <v-col>
          <v-text-field label="Protein" v-model="model.nutrition.protein" :rules="[rules.isDecimal('Protein')]" />
        </v-col>
        <v-col>
          <v-text-field label="Carbohydrates" v-model="model.nutrition.carbohydrates" :rules="[rules.isDecimal('Carbohydrates')]" />
        </v-col>
        <v-col>
          <v-text-field label="Fat" v-model="model.nutrition.fat" :rules="[rules.isDecimal('Fat')]" />
        </v-col>
        <v-col>
          <v-text-field label="Sodium" v-model="model.nutrition.sodium" :rules="[rules.isDecimal('Sodium')]" />
        </v-col>
      </v-row>
      <v-btn @click="submit" :loading="isSubmitting">Submit</v-btn>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
import ItemList from "@/components/ItemList";
import { isInteger, isDecimal, isRequired, isSlug } from "@/scripts/validations";
import { eventBus } from "@/main";
import { AlertKeys, Severity } from "@/constants/enums";
import { mapRecipeToApi } from "@/scripts/mapping";

export default {
  name: "RecipeEditor",
  components: { ItemList },
  data: () => ({
    timeOptions: ["minutes", "hours", "days"],
    customTimeTypes: [],
    servingTypes: [],
    categories: [],
    cuisines: [],
    tags: [],
    model: {
      title: "",
      ingredients: [],
      instructions: [],
      category: "",
      cuisine: "",
      servings: "",
      servingType: "",
      preparationTimeDays: "",
      preparationTimeHours: "",
      preparationTimeMinutes: "",
      cookingTimeDays: "",
      cookingTimeHours: "",
      cookingTimeMinutes: "",
      customTimeDays: "",
      customTimeHours: "",
      customTimeMinutes: "",
      customTimeType: "",
      nutrition: {
        energy: "",
        protein: "",
        carbohydrates: "",
        fat: "",
        sodium: "",
      },
      tags: [],
      units: [],
      slug: "",
    },
    isSlugValid: false,
    isSubmitting: false,
    rules: {
      required(labelName) {
        return (value) => isRequired(value, `${labelName} is required`);
      },
      isInteger(labelName) {
        return (value) => isInteger(value, `${labelName} must be an integer`);
      },
      isDecimal(labelName) {
        return (value) => isDecimal(value, `${labelName} must be a number`);
      },
      isSlug() {
        return (slug) =>
          isSlug(slug, "URL slug must only contain alphanumeric characters and hyphens, such as my-new-recipe or MyNewRecipe");
      },
      customTimeTypeRequired(customTimeType, customMinutes, customHours, customDays) {
        return !!customTimeType || (!customMinutes && !customHours && !customDays && !customTimeType) || "Custom time type is required";
      },
    },
  }),
  async mounted() {
    await axios
      .get(process.env.VUE_APP_APIURL + "/recipes/editor/dropdown-options")
      .then((response) => {
        this.categories = response.data.categories.map((c) => c.label);
        this.cuisines = response.data.cuisines.map((c) => c.label);
        this.customTimeTypes = response.data.customTimeTypes.map((ct) => ct.label);
        this.servingTypes = response.data.servingTypes.map((st) => st.label);
        this.tags = response.data.tags.map((t) => t.label);

        // Default to servings if it's a valid option
        if (this.servingTypes.includes("servings")) {
          this.model.servingType = "servings";
        }
      })
      .catch((error) => console.log(error));
  },
  methods: {
    goToRecipes() {
      this.$router.push("/");
    },
    updateSlug() {
      this.model.slug = this.model.title
        .toLowerCase()
        .trim()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
    },
    async createSlug() {
      let chosenSlug = this.model.slug || "recipe";
      await axios
        .get(process.env.VUE_APP_APIURL + "/recipes/slugs", {
          params: {
            chosenSlug: chosenSlug,
          },
        })
        .then((response) => {
          if (chosenSlug !== response.data) {
            eventBus.$emit(AlertKeys.ADD, Severity.INFO, "The entered slug is already in use, a unique slug has been provided");
          }
          this.model.slug = response.data;
          this.isSlugValid = true;
        })
        .catch((error) => console.log(error));
    },
    async submit() {
      if (!this.$refs.editor.validate()) {
        eventBus.$emit(AlertKeys.ADD, Severity.ERROR, "The recipe is invalid. Please check your entered data");
        return;
      }
      this.isSubmitting = true;
      console.log(JSON.stringify(this.model));
      await axios
        .post(process.env.VUE_APP_APIURL + "/recipes", mapRecipeToApi(this.model))
        .then(() => {
          this.isSubmitting = false;
          eventBus.$emit(AlertKeys.ADD, Severity.SUCCESS, "Recipe created");
        })
        .catch((error) => {
          this.isSubmitting = false;
          eventBus.$emit(AlertKeys.ADD, Severity.ERROR, "An error occurred while creating the recipe");
          console.log(error);
        });
    },
  },
};
</script>

<style scoped></style>
