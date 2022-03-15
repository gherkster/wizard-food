<template>
  <div>
    <p>Recipe Editor</p>
    <v-btn @click="goToRecipes">Go to recipes</v-btn>
    <v-form ref="editor">
      <v-row>
        <v-col>
          <v-text-field label="Recipe Title" v-model="model.title" />
        </v-col>
        <v-col>
          <v-file-input accept="image/*" label="Recipe Banner" />
          <!-- TODO setup v-model -->
        </v-col>
      </v-row>
      <!-- Ingredients -->
      <h2>Ingredients</h2>
      <v-row v-for="item in model.ingredients" :key="item.id">
        <v-text-field
          v-if="item.type === 'section'"
          label="Section"
          v-model="item.label"
        />
        <template v-else>
          <v-text-field label="Ingredient" v-model="item.label" />
          <v-text-field label="Notes" v-model="item.note" />
        </template>
      </v-row>
      <v-btn @click="addIngredientsSection">Add ingredient section</v-btn>
      <v-btn @click="addIngredient">Add ingredient</v-btn>
      <!-- Instructions -->
      <h2>Instructions</h2>
      <v-row v-for="item in model.instructions" :key="item.id">
        <v-text-field
          v-if="item.type === 'section'"
          label="Section"
          v-model="item.label"
        />
        <v-text-field v-else label="Instruction" v-model="item.label" />
        <!-- TODO: Validation to prevent duplicate instructions -->
      </v-row>
      <v-btn @click="addInstructionsSection">Add instruction section</v-btn>
      <v-btn @click="addInstruction">Add instruction</v-btn>
      <!-- Metadata -->
      <h2>Metadata</h2>
      <v-row>
        <v-col>
          <v-text-field label="Servings" v-model="model.servings" />
        </v-col>
        <v-col>
          <v-combobox
            label="Serving Type"
            v-model="model.servingType"
            :items="servingTypes"
          />
        </v-col>
        <v-col>
          <v-combobox label="Cuisine" v-model="model.cuisine" :items="cuisines"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field label="Prep time" v-model="model.preparationTime" />
          <v-select v-model="model.preparationTimeUnits" :items="timeOptions" />
        </v-col>
        <v-col>
          <v-text-field label="Cooking time" v-model="model.cookingTime" />
          <v-select v-model="model.cookingTimeUnits" :items="timeOptions" />
        </v-col>
        <v-col>
          <v-text-field label="Custom time" v-model="model.customTime" />
          <v-select v-model="model.customTimeUnits" :items="timeOptions" />
          <v-combobox
            label="Custom time type"
            v-model="model.customTimeTypeLabel"
            :items="customTimeTypes"
          />
        </v-col>
        <v-col>
          <v-combobox label="Tags" chips multiple v-model="model.tags" :items="tags" />
          <v-text-field label="Slug" prefix="/" v-model="model.slug" />
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
          <v-text-field label="Carbohydrates" v-model="model.nutrition.carbohydrates"/>
        </v-col>
        <v-col>
          <v-text-field label="Fat" v-model="model.nutrition.fat" />
        </v-col>
        <v-col>
          <v-text-field label="Sodium" v-model="model.nutrition.sodium" />
        </v-col>
      </v-row>
      <v-btn @click="submitRecipe">Submit</v-btn>
    </v-form>
  </div>
</template>

<script>
import { uuid } from "vue-uuid";

export default {
  name: "RecipeEditor",
  components: {},
  data: () => ({
    unitOptions: ["g", "kg", "tsp", "tbsp"],
    timeOptions: ["minutes", "hours", "days"],
    customTimeTypes: ["fermenting", "aging"],
    servingTypes: ["servings", "slices"],
    cuisines: ["chinese", "thai"],
    tags: ["food", "meat"],
    model: {
      title: "",
      ingredients: [],
      instructions: [],
      category: "",
      cuisine: "",
      servings: 0,
      servingType: "",
      preparationTime: "",
      preparationTimeUnits: "minutes",
      cookingTime: "",
      cookingTimeUnits: "minutes",
      customTime: "",
      customTimeUnits: "minutes",
      customTimeTypeLabel: "",
      nutrition: {
        kj: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        sodium: 0,
      },
      tags: [],
      slug: "",
    },
  }),
  methods: {
    goToRecipes() {
      this.$router.push("/");
    },
    addIngredientsSection() {
      this.model.ingredients.push({
        id: uuid.v1(),
        type: "section",
        label: "",
        note: "",
      });
    },
    addIngredient() {
      this.model.ingredients.push({
        id: uuid.v1(),
        type: "ingredient",
        label: "",
        note: "",
      });
    },
    addInstructionsSection() {
      this.model.instructions.push({
        id: uuid.v1(),
        type: "section",
        label: "",
      });
    },
    addInstruction() {
      this.model.instructions.push({
        id: uuid.v1(),
        type: "ingredient",
        label: "",
      });
    },
    submitRecipe() {
      this.$refs.editor.validate();
      console.log("stringifying");
      let x = JSON.stringify(this.model);
      console.log(x);
    },
  },
};
</script>

<style scoped></style>
