<template>
  <div class="page">
    <div v-if="recipe" class="content recipe">
      <x-row class="wide-gap">
        <x-column col-12 col-lg-5>
          <x-row>
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            />
          </x-row>
        </x-column>
        <x-column col-12 col-lg-7>
          <x-row>
            <h1>{{ recipe.title }}</h1>
            <n-button v-if="userStore.isAuthenticated" @click="goToEditRecipe">Edit</n-button>
            <!-- Rating inline with title? Could wrap underneath on mobile-->
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
              <span v-if="totalDuration">{{ totalDuration }}</span>
              <span v-for="d in allDurations" :key="d.duration.name"
                >{{ d.duration.name }} <b>{{ d.label }}</b></span
              >
            </div>
          </x-row>
        </x-column>
      </x-row>
      <x-row class="wide-gap">
        <x-column col-12 col-lg-5>
          <div v-if="recipe.ingredientGroups.length > 0" class="recipe__ingredients">
            <div class="recipe__ingredients-title">
              <h2>Ingredients</h2>
              <div class="recipe__multiplier">
                <font-awesome-icon icon="minus" :class="{ disabled: ingredientMultiplier <= 1 }" @click="decreaseMultiplier" />
                <span>{{ ingredientMultiplier }}</span>
                <font-awesome-icon icon="plus" @click="increaseMultiplier" />
              </div>
            </div>
            <div v-for="ingredientSection in recipe.ingredientGroups" :key="JSON.stringify(ingredientSection)">
              <span v-if="ingredientSection.name">
                <b>{{ ingredientSection.name }}</b>
              </span>
              <ul>
                <li v-for="ingredient in ingredientSection.ingredients" :key="JSON.stringify(ingredient)">
                  <span>{{ adjustIngredientByMultiplier(ingredient.amount) }} {{ ingredient.unit }} {{ ingredient.name }}</span>
                  <span v-if="ingredient.note" class="text-muted"><i>&nbsp;{{ ingredient.note }}</i></span>
                </li>
              </ul>
            </div>
          </div>
        </x-column>
        <x-column col-12 col-lg-7>
          <div v-if="recipe.instructionGroups.length > 0">
            <h2>Instructions</h2>
            <div
              v-for="instructionSection in recipe.instructionGroups"
              :key="JSON.stringify(instructionSection)"
              class="instruction-section"
            >
              <span v-if="instructionSection.name">
                <b>{{ instructionSection.name }}</b>
              </span>
              <div class="instruction-group">
                <div v-for="(instruction, index) in instructionSection.instructions" :key="JSON.stringify(instruction)" class="instruction">
                  <h4>{{ index + 1 }}</h4>
                  <span>{{ instruction.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </x-column>
      </x-row>
      <x-row v-if="recipe.note" class="wide-gap">
        <x-column>
          <h2>Notes</h2>
          <div v-html="recipe.note" />
        </x-column>
      </x-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NTag, NButton } from "naive-ui";
import { formatDuration } from "@/scripts/utility";
import { XRow, XColumn } from "@/components";
import apis from "@/constants/apis";
import { useUserStore } from "@/store/userStore";
import { useAxios } from "@/composables";
import Fraction from "fraction.js";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Recipe, RecipeDuration, IngredientFraction } from "@/types/recipe";

const userStore = useUserStore();
const axios = useAxios();
const route = useRoute();
const router = useRouter();

const { data } = await axios.get<Recipe>(apis.recipes + route.params.slug);

const recipe = ref(data);
const ingredientMultiplier = ref(recipe.value.servings > 0 ? recipe.value.servings : 1);

const allDurations = computed<Array<{ duration: RecipeDuration; label: string }>>(() => {
  const durationLabels: Array<{ duration: RecipeDuration; label: string }> = [];

  if (recipe.value.preparationDuration) {
    const formattedDuration = formatDuration(recipe.value.preparationDuration);
    if (formattedDuration) {
      durationLabels.push({ duration: recipe.value.preparationDuration, label: formattedDuration });
    }
  }
  if (recipe.value.cookingDuration) {
    const formattedDuration = formatDuration(recipe.value.cookingDuration);
    if (formattedDuration) {
      durationLabels.push({ duration: recipe.value.cookingDuration, label: formattedDuration });
    }
  }
  recipe.value.customDurations.forEach((cd) => {
    const formattedDuration = formatDuration(cd);
    if (formattedDuration) {
      durationLabels.push({ duration: cd, label: formattedDuration });
    }
  });
  return durationLabels;
});

const totalDuration = computed(() => {
  let totalMinutes = 0;
  let totalHours = 0;
  let totalDays = 0;
  allDurations.value.forEach((d) => {
    totalMinutes += d.duration.minutes;
    totalHours += d.duration.hours;
    totalDays += d.duration.days;
  });
  const totalDuration: RecipeDuration = {
    minutes: totalMinutes,
    hours: totalHours,
    days: totalDays,
    name: "",
  };
  return formatDuration(totalDuration);
});

function adjustIngredientByMultiplier(amount: IngredientFraction) {
  if (!amount) {
    return "";
  }
  const fraction = new Fraction(amount.numerator, amount.denominator);
  const numberOfServings = recipe.value.servings > 0 ? recipe.value.servings : 1;
  return fraction.mul(ingredientMultiplier.value).div(numberOfServings).toFraction(true);
}

function increaseMultiplier() {
  ingredientMultiplier.value++;
}
function decreaseMultiplier() {
  if (ingredientMultiplier.value > 1) {
    ingredientMultiplier.value--;
  }
}

function goToEditRecipe() {
  router.push(`/recipes/${route.params.slug}/edit`);
}
</script>

<style lang="scss" scoped>
@use "../../styles/mixins" as m;
.instruction-section {
  @include m.spacing("mt", "sm");
}
.instruction-group {
  display: flex;
  flex-direction: column;
  @include m.spacing("gy", "xs");
}
.instruction {
  display: flex;
  @include m.spacing("gx", "sm");
  > h4 {
    margin: 0;
  }
}
</style>
