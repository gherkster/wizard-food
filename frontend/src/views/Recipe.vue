<template>
  <div class="container">
    <div v-if="isLoading">
      <p>Loading...</p>
      <!-- TODO: Skeleton loaders -->
    </div>
    <div v-else>
      <div class="row">
        <div class="col-12">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          />
        </div>
      </div>
      <div class="row recipe__header">
        <div class="col-12">
          <h1>{{ recipe.title }}</h1>
          <rating path="" :value="recipe.rating" :length="5" />
          <p>{{ recipe.description }}</p>
        </div>
      </div>
      <div class="row recipe__nutrition" v-if="displayedNutritionOptions.length > 0">
        <div class="col-sm-12 col-md-4">
          <h2>Nutrition</h2>
          <p>(per serving)</p>
          <div class="row">
            <div v-for="nut in displayedNutritionOptions" :key="nut" class="col-6">
              <span>{{ capitalizeFirstCharacter(nut) }}</span>
              <span>
                <b>{{ recipe.nutrition[nut] }}</b>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="row recipe__details">
        <div class="col-12">
          <h2>Details</h2>
        </div>
        <div class="col-3" v-if="preparationDuration">
          <span>Preparation</span>
          <span>{{ preparationDuration }}</span>
        </div>
        <div class="col-3" v-if="cookingDuration">
          <span>Cooking</span>
          <span>{{ cookingDuration }}</span>
        </div>
        <div class="col-3" v-if="customDuration">
          <span>{{ capitalizeFirstCharacter(recipe.customTimeType) }}</span>
          <span>{{ customDuration }}</span>
        </div>
        <div class="col-3" v-if="totalDuration">
          <span>Total</span>
          <span>{{ totalDuration }}</span>
        </div>
      </div>
      <div class="row recipe__servings">
        <div class="col-6">
          <h4>{{ capitalizeFirstCharacter(recipe.servingType) }}</h4>
        </div>
        <div class="col-6">
          <div class="ingredient-multiplier-wrapper">
            <input-button :disabled="ingredientMultiplier <= 1" @click="ingredientMultiplier--">
              <icon fa-icon="fa-minus" />
            </input-button>
            <span>{{ ingredientMultiplier }}</span>
            <input-button @click="ingredientMultiplier++">
              <icon fa-icon="fa-plus" />
            </input-button>
          </div>
        </div>
      </div>
      <div class="row recipe__ingredients" v-if="this.groupedIngredients.length > 0">
        <div class="col-12">
          <h2>Ingredients</h2>
          <div v-for="ingredientSection in this.groupedIngredients" :key="JSON.stringify(ingredientSection)" class="list-section">
            <span v-if="ingredientSection.section">
              <b>{{ ingredientSection.section }}</b>
            </span>
            <ul>
              <li v-for="ingredient in ingredientSection.ingredients" :key="JSON.stringify(ingredient)">
                <span>{{ adjustIngredientByMultiplier(ingredient.amount) }}</span>
                <span>{{ ingredient.unit }}</span>
                <span> {{ ingredient.label }}</span>
                <span v-if="ingredient.note" class="text-muted"> {{ ingredient.note }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="row recipe__instructions" v-if="this.groupedInstructions.length > 0">
        <div class="col-12">
          <h2>Instructions</h2>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { capitalizeFirstChar } from "@/scripts/utility";
import InputButton from "@/components/molecules/InputButton";
import Icon from "@/components/atoms/Icon";
import Rating from "@/components/molecules/Rating";

export default {
  name: "Recipe",
  components: { Rating, Icon, InputButton },
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
      if (totalHours > 0) formatStrings.push("H [hrs]");
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
  &__servings {
    background-color: variables.$colour-bg-grey-light;
    > div {
      align-self: center;
      > .ingredient-multiplier-wrapper {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: right;
        gap: variables.$border-radius;
        > p {
          margin-bottom: 0;
        }
      }
    }
  }
  &__nutrition {
    background-color: variables.$colour-bg-grey-light;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
