<template>
  <div>
    <p>Recipe Editor</p>
    <v-btn @click="goToRecipes">Go to recipes</v-btn>
    <v-form ref="editor">
      <v-row>
        <v-col>
          <v-text-field label="Recipe Title" v-model="model.title" :rules="[rules.required('Title')]" />
        </v-col>
        <v-col>
          <v-file-input accept="image/*" label="Recipe Banner" />
          <!-- TODO setup v-model -->
        </v-col>
      </v-row>
      <h2>Ingredients</h2>
      <item-list v-model="model.ingredients" item-label="Ingredient" has-note />
      <h2>Instructions</h2>
      <item-list v-model="model.instructions" item-label="Instruction" />
      <!-- Metadata -->
      <h2>Metadata</h2>
      <v-row>
        <v-col>
          <v-text-field label="Servings" v-model="model.servings" :rules="[rules.required('Servings')]" />
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
        <p>Preparation time</p>
        <v-col>
          <v-text-field label="Minutes" v-model="model.preparationTimeMinutes" />
        </v-col>
        <v-col>
          <v-text-field label="Hours" v-model="model.preparationTimeHours" />
        </v-col>
        <v-col>
          <v-text-field label="Days" v-model="model.preparationTimeDays" />
        </v-col>
      </v-row>
      <v-row>
        <p>Cooking time</p>
        <v-col>
          <v-text-field label="Minutes" v-model="model.cookingTimeMinutes" />
        </v-col>
        <v-col>
          <v-text-field label="Hours" v-model="model.cookingTimeHours" />
        </v-col>
        <v-col>
          <v-text-field label="Days" v-model="model.cookingTimeDays" />
        </v-col>
      </v-row>
      <p>Custom times</p>
      <v-row v-for="item in model.customTimes" :key="item.uuid">
        <v-text-field label="Minutes" v-model="item.customTimeMinutes" />
        <v-text-field label="Hours" v-model="item.customTimeHours" />
        <v-text-field label="Days" v-model="item.customTimeDays" />
        <v-combobox
          label="Type"
          v-model="item.customTimeLabel"
          :items="customTimeTypes"
          :rules="[rules.required('Type'), noDuplicateCustomTimes(model.customTimes)]"
        />
      </v-row>
      <v-btn @click="addCustomTime">Add custom time</v-btn>
      <v-row>
        <v-col>
          <v-combobox label="Tags" chips multiple v-model="model.tags" :items="tags" />
          <v-text-field
            label="Slug"
            prefix="/"
            v-model="model.slug"
            :rules="[rules.required('Slug')]"
            append-outer-icon="mdi-reload"
            @click:append-outer="createSlug"
            :hint="suggestedSlug ? 'For example: ' + suggestedSlug : ''"
            persistent-hint
          />
        </v-col>
      </v-row>
      <!-- Nutrition -->
      <h2>Nutrition</h2>
      <v-row>
        <v-col>
          <v-text-field label="KJ" v-model="model.nutrition.kj" />
        </v-col>
        <v-col>
          <v-text-field label="Protein" v-model="model.nutrition.protein" />
        </v-col>
        <v-col>
          <v-text-field label="Carbohydrates" v-model="model.nutrition.carbohydrates" />
        </v-col>
        <v-col>
          <v-text-field label="Fat" v-model="model.nutrition.fat" />
        </v-col>
        <v-col>
          <v-text-field label="Sodium" v-model="model.nutrition.sodium" />
        </v-col>
      </v-row>
      <v-btn @click="submit">Submit</v-btn>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
import { uuid } from "vue-uuid";
import ItemList from "@/components/ItemList";
import { isRequired, noDuplicates } from "@/scripts/validations";

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
      customTimes: [],
      nutrition: {
        kj: "",
        protein: "",
        carbohydrates: "",
        fat: "",
        sodium: "",
      },
      tags: [],
      slug: null,
    },
    rules: {
      required(labelName) {
        return (value) => isRequired(value, `${labelName} is required`);
      },
    },
  }),
  computed: {
    suggestedSlug: function () {
      return this.model.title
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
    },
    noDuplicateCustomTimes: function () {
      return (values) =>
        noDuplicates(
          values.map((v) => v.customTimeLabel),
          "No duplicate values"
        );
    },
  },
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
    addCustomTime() {
      this.model.customTimes.push({
        uuid: uuid.v1(),
        customTimeDays: "",
        customTimeHours: "",
        customTimeMinutes: "",
        customTimeLabel: "",
      });
    },
    async createSlug() {
      await axios
        .get(process.env.VUE_APP_APIURL + "/recipes/slugs", {
          params: {
            chosenSlug: this.model.slug ?? this.suggestedSlug,
          },
        })
        .then((response) => {
          if (this.model.slug !== response.data) {
            // TODO: Notify user that the slug has been updated because the entered one was unavailable
          }
          this.model.slug = response.data;
        })
        .catch((error) => console.log(error));
    },
    async submit() {
      this.$refs.editor.validate();
      console.log(JSON.stringify(this.model));
      /*await axios
        .post(process.env.VUE_APP_APIURL + "/recipes", this.model)
        .then((response) => console.log(response))
        .catch((error) => console.log(error));*/
    },
  },
};
</script>

<style scoped></style>
