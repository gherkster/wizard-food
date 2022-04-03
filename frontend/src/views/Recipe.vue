<template>
  <div>
    <div v-if="isLoading">
      <p>Loading...</p>
      <v-skeleton-loader type="card" />
    </div>
    <div v-else>
      <v-row class="recipe__image">
        <v-col>
          <v-img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          />
        </v-col>
      </v-row>
      <v-row class="recipe__header">
        <v-col>
          <h1>{{ recipe.title }}</h1>
          <pre>Recipe description: {{ recipe.description }}</pre>
        </v-col>
      </v-row>
      <v-row class="recipe__facts">
        <v-col>
          <h2>Details</h2>
          <p v-if="preparationDuration">Preparation: {{ preparationDuration }}</p>
          <p v-if="cookingDuration">Cooking: {{ cookingDuration }}</p>
          <p v-if="customDuration">{{ capitalizeFirstCharacter(recipe.customTimeType) }}: {{ customDuration }}</p>
          <p v-if="totalDuration">Total: {{ totalDuration }}</p>
        </v-col>
      </v-row>
      <v-row class="recipe__rating" justify="center">
        <v-rating :value="recipe.rating" length="5" size="32" readonly />
      </v-row>
      <v-row class="recipe__servings">
        <v-col>
          <h4>{{ capitalizeFirstCharacter(recipe.servingType) }}</h4>
        </v-col>
        <v-col>
          <div class="ingredient-multiplier-wrapper">
            <v-btn @click="ingredientMultiplier--" :disabled="ingredientMultiplier <= 1">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <p>{{ ingredientMultiplier }}</p>
            <v-btn @click="ingredientMultiplier++">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="this.groupedIngredients.length > 0" class="recipe__ingredients">
        <v-col>
          <h2>Ingredients</h2>
          <div v-for="ingredientSection in this.groupedIngredients" :key="JSON.stringify(ingredientSection)">
            <h3>{{ ingredientSection.section }}</h3>
            <ul>
              <li v-for="ingredient in ingredientSection.ingredients" :key="JSON.stringify(ingredient)">
                {{ adjustIngredientByMultiplier(ingredient.amount) }}{{ ingredient.unit }} {{ ingredient.label }} {{ ingredient.note }}
              </li>
            </ul>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="this.groupedInstructions.length > 0" class="recipe__instructions">
        <v-col>
          <h2>Instructions</h2>
          <div v-for="instructionSection in this.groupedInstructions" :key="JSON.stringify(instructionSection)">
            <h3>{{ instructionSection.section }}</h3>
            <ol>
              <li v-for="instruction in instructionSection.instructions" :key="JSON.stringify(instruction)">{{ instruction.label }}</li>
            </ol>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="displayedNutritionOptions.length > 0" class="recipe__nutrition">
        <v-col cols="12">
          <h2>Nutrition</h2>
          <p>(per serving)</p>
        </v-col>
        <v-col v-for="nut in displayedNutritionOptions" :key="nut" cols="6">
          <span>{{ capitalizeFirstCharacter(nut) }}</span>
          <span>
            <b>{{ recipe.nutrition[nut] }}</b>
          </span>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { capitalizeFirstChar } from "@/scripts/utility";

export default {
  name: "Recipe",
  data: () => ({
    recipe: null,
    ingredientMultiplier: 1,
    groupedIngredients: [],
    groupedInstructions: [],
    isLoading: true,
  }),
  async created() {
    await axios
      .get(process.env.VUE_APP_APIURL + "/api/recipes/" + this.$route.params.slug)
      .then((response) => {
        this.recipe = response.data;
        this.ingredientMultiplier = this.recipe.servings;

        let currentIngredientSection = "";
        this.recipe.ingredients.forEach((ing) => {
          if (ing.itemType === "Section") {
            currentIngredientSection = ing.label;
            return; // Don't add API sections to the ingredient/instruction arrays
          }
          let currentSectionIndex = this.groupedIngredients.findIndex((gi) => gi.section === currentIngredientSection);
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
          let currentSectionIndex = this.groupedInstructions.findIndex((gi) => gi.section === currentInstructionSection);
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
    displayedNutritionOptions: function () {
      return Object.keys(this.recipe.nutrition).filter((key) => this.recipe.nutrition[key] > 0);
    },
    preparationDuration: function () {
      return this.formatDuration(this.recipe.preparationTime);
    },
    cookingDuration: function () {
      return this.formatDuration(this.recipe.cookingTime);
    },
    customDuration: function () {
      return this.formatDuration(this.recipe.customTime);
    },
    totalDuration: function () {
      return this.formatDuration(this.recipe.preparationTime, this.recipe.cookingTime, this.recipe.customTime);
    },
  },
  methods: {
    adjustIngredientByMultiplier(amount) {
      return amount * (this.ingredientMultiplier / this.recipe.servings);
    },
    capitalizeFirstCharacter(string) {
      return capitalizeFirstChar(string);
    },
    formatDuration() {
      let durations = Array.prototype.slice.call(arguments);

      let totalDays = 0;
      let totalHours = 0;
      let totalMinutes = 0;
      durations.forEach((duration) => {
        totalDays += duration.days;
        totalHours += duration.hours;
        totalMinutes += duration.minutes;
      });

      dayjs.extend(duration);
      let dur = dayjs.duration(0);
      dur = dur.add(totalDays, "day").add(totalHours, "hour").add(totalMinutes, "minute");

      let formatStrings = [];
      if (totalDays > 0) formatStrings.push("D [days]");
      if (totalHours > 0) formatStrings.push("H [hours]");
      if (totalMinutes > 0) formatStrings.push("m [mins]");
      if (formatStrings.length === 0) return null;

      return dur.format(formatStrings.join(" "));
    },
  },
};
</script>

<style scoped lang="scss">
@use "./src/styles/variables";
.recipe {
  &__header {
  }
  &__facts {
  }
  &__servings {
    background-color: variables.$bg-grey-light;
    > .col {
      align-self: center;
      > .ingredient-multiplier-wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: right;
        gap: 8px;
        > p {
          margin-bottom: 0;
        }
      }
    }
  }
  &__nutrition {
    background-color: variables.$bg-grey-light;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
