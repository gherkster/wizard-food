<template>
  <div class="page">
    <div v-if="recipe" class="content recipe">
      <x-row>
        <x-column col-lg-5>
          <x-row>
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            />
          </x-row>
        </x-column>
        <x-column col-lg-7>
          <x-row>
            <h1>{{ recipe.title }}</h1><!-- Rating inline with title? Could wrap underneath on mobile-->
            <!-- kJ? -->
          </x-row>
          <x-row>
            <div class="recipe__tags">
              <n-tag>{{ recipe.category }}</n-tag>
              <n-tag>{{ recipe.cuisine }}</n-tag>
              <n-tag v-for="tag in recipe.tags" :key="tag">{{ tag }}</n-tag>
            </div>
          </x-row>
          <x-row>
            <div class="recipe__duration">
              <span v-if="preparationDuration">Preparation <strong>{{ preparationDuration }}</strong></span>
              <span v-if="cookingDuration">Cooking <strong>{{ cookingDuration }}</strong></span>
              <!-- TODO: Needs to be a list of custom durations -->
              <span v-if="customDuration">{{ capitalizeFirstCharacter(recipe.customTimeType) }} <strong>{{ customDuration }}</strong></span>
              <span v-if="totalDuration">Total <strong>{{ totalDuration }}</strong></span>
            </div>
          </x-row>
        </x-column>
      </x-row>
      <x-row>
        <x-column col-lg-5>
          <h3>Ingredients {{ recipe.servings }}</h3>
          <div v-for="ingredientSection in this.groupedIngredients" :key="JSON.stringify(ingredientSection)" class="list-section">
            <span v-if="ingredientSection.section">
              <b>{{ ingredientSection.section }}</b>
            </span>
            <ul>
              <li v-for="ingredient in ingredientSection.ingredients" :key="JSON.stringify(ingredient)">
                <span>{{ adjustIngredientByMultiplier(ingredient.amount) }}</span>
                <span>{{ ingredient.unit }}&nbsp;</span>
                <span> {{ ingredient.label }}</span>
                <span v-if="ingredient.note" class="text-muted">&nbsp;{{ ingredient.note }}</span>
              </li>
            </ul>
          </div>
        </x-column>
        <x-column col-lg-7>
          <h3>Instructions</h3>
          <div v-for="instructionSection in this.groupedInstructions" :key="JSON.stringify(instructionSection)" class="list-section">
            <span v-if="instructionSection.section">
              <b>{{ instructionSection.section }}</b>
            </span>
            <ol>
              <li v-for="instruction in instructionSection.instructions" :key="JSON.stringify(instruction)">
                <span>{{ instruction.label }}</span>
              </li>
            </ol>
          </div>
        </x-column>
      </x-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { NTag } from "naive-ui";
import { capitalizeFirstChar, formatDuration } from "@/scripts/utility";
import { XRow, XColumn } from "@/components";

export default {
  name: "Recipe",
  components: { XRow, XColumn, NTag },
  data: () => ({
    recipe: null,
    ingredientMultiplier: 1,
    groupedIngredients: [],
    groupedInstructions: [],
    isLoading: true,
  }),
  async created() {
    await axios
      .get(import.meta.env.VITE_APIURL + "/api/recipes/" + this.$route.params.slug)
      .then((response) => {
        this.recipe = response.data;
        this.ingredientMultiplier = this.recipe.servings;

        let currentIngredientSection = "";
        this.recipe.ingredients.forEach((ing) => {
          if (ing.itemType === "Section") {
            currentIngredientSection = ing.label;
            return; // Don't add API sections to the ingredient/instruction arrays
          }
          const currentSectionIndex = this.groupedIngredients.findIndex((gi) => gi.section === currentIngredientSection);
          if (currentSectionIndex > -1) {
            this.groupedIngredients[currentSectionIndex].ingredients.push(ing);
          } else {
            this.groupedIngredients.push({
              section: currentIngredientSection,
              ingredients: [ing],
            });
          }
        });

        // TODO: Combine logic with above
        let currentInstructionSection = "";
        this.recipe.instructions.forEach((ing) => {
          if (ing.itemType === "Section") {
            currentInstructionSection = ing.label;
            return; // Don't add API sections to the ingredient/instruction arrays
          }
          const currentSectionIndex = this.groupedInstructions.findIndex((gi) => gi.section === currentInstructionSection);
          if (currentSectionIndex > -1) {
            this.groupedInstructions[currentSectionIndex].instructions.push(ing);
          } else {
            this.groupedInstructions.push({
              section: currentInstructionSection,
              instructions: [ing],
            });
          }
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => (this.isLoading = false));
  },
  computed: {
    preparationDuration: function () {
      return formatDuration(this.recipe.preparationTime);
    },
    cookingDuration: function () {
      return formatDuration(this.recipe.cookingTime);
    },
    customDuration: function () {
      return formatDuration(this.recipe.customTime);
    },
    totalDuration: function () {
      return formatDuration(this.recipe.preparationTime, this.recipe.cookingTime, this.recipe.customTime);
    },
    numberOfDurations: function () {
      return [this.preparationDuration, this.cookingDuration, this.customDuration].filter((d) => d !== null).length;
    },
  },
  methods: {
    adjustIngredientByMultiplier(amount) {
      return amount * (this.ingredientMultiplier / this.recipe.servings);
    },
    capitalizeFirstCharacter(string) {
      return capitalizeFirstChar(string);
    },
  },
};
</script>
