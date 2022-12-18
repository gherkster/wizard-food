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
            <h1>{{ recipe.title }}</h1>
            <n-button @click="goToEditRecipe">Edit</n-button>
            <!-- Rating inline with title? Could wrap underneath on mobile-->
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
              <span v-for="d in allDurations" :key="d.name">{{ d.name }} {{ d.duration }}</span>
            </div>
          </x-row>
        </x-column>
      </x-row>
      <x-row>
        <x-column col-lg-5>
          <h3>Ingredients {{ recipe.servings }}</h3>
          <div v-for="ingredientSection in recipe.ingredientGroups" :key="JSON.stringify(ingredientSection)" class="list-section">
            <span v-if="ingredientSection.name">
              <b>{{ ingredientSection.name }}</b>
            </span>
            <ul>
              <li v-for="ingredient in ingredientSection.ingredients" :key="JSON.stringify(ingredient)">
                <span>{{ adjustIngredientByMultiplier(ingredient.amount) }}</span>
                <span>{{ ingredient.unit }}&nbsp;</span>
                <span> {{ ingredient.name }}</span>
                <span v-if="ingredient.note" class="text-muted">&nbsp;{{ ingredient.note }}</span>
              </li>
            </ul>
          </div>
        </x-column>
        <x-column col-lg-7>
          <h3>Instructions</h3>
          <div v-for="instructionSection in recipe.instructionGroups" :key="JSON.stringify(instructionSection)" class="list-section">
            <span v-if="instructionSection.name">
              <b>{{ instructionSection.name }}</b>
            </span>
            <ol>
              <li v-for="instruction in instructionSection.instructions" :key="JSON.stringify(instruction)">
                <span>{{ instruction.label }}</span>
              </li>
            </ol>
          </div>
        </x-column>
      </x-row>
      <x-row v-if="recipe.note">
        <x-column>
          <h3>Notes</h3>
          <p>{{ recipe.note }}</p>
        </x-column>
      </x-row>
    </div>
  </div>
</template>

<script>
import { NTag, NButton } from "naive-ui";
import { capitalizeFirstChar, formatDurations } from "@/scripts/utility";
import { XRow, XColumn } from "@/components";
import apis from "@/constants/apis";

export default {
  name: "Recipe",
  components: { XRow, XColumn, NButton, NTag },
  data: () => ({
    recipe: null,
    ingredientMultiplier: 1,
    groupedIngredients: [],
    groupedInstructions: [],
    isLoading: true,
  }),
  async created() {
    await this.$axios
      .get(apis.recipes + this.$route.params.slug)
      .then((response) => {
        this.recipe = response.data;
        this.ingredientMultiplier = this.recipe.servings;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => (this.isLoading = false));
  },
  computed: {
    preparationDuration: function () {
      if (this.recipe.preparationDuration) {
        return {
          name: this.recipe.preparationDuration.name,
          duration: formatDurations([this.recipe.preparationDuration]),
        };
      }
      return null;
    },
    cookingDuration: function () {
      if (this.recipe.cookingDuration) {
        return {
          name: this.recipe.cookingDuration.name,
          duration: formatDurations([this.recipe.cookingDuration]),
        };
      }
      return null;
    },
    customDurations: function () {
      const formattedDurations = [];
      this.recipe.customDurations.forEach((duration) => {
        const formattedDuration = formatDurations([duration]);
        if (formattedDuration) {
          formattedDurations.push({
            name: duration.name,
            duration: formattedDuration,
          });
        }
      });
      return formattedDurations;
    },
    allDurations: function () {
      const durations = [];
      if (this.preparationDuration) {
        durations.push(this.preparationDuration);
      }
      if (this.cookingDuration) {
        durations.push(this.cookingDuration);
      }
      return durations.concat(this.customDurations);
    },
    totalDuration: function () {
      return formatDurations(this.allDurations);
    },
  },
  methods: {
    adjustIngredientByMultiplier(amount) {
      return amount * (this.ingredientMultiplier / this.recipe.servings);
    },
    capitalizeFirstCharacter(string) {
      return capitalizeFirstChar(string);
    },
    goToEditRecipe() {
      this.$router.push(`/recipes/${this.$route.params.slug}/edit`);
    },
  },
};
</script>
