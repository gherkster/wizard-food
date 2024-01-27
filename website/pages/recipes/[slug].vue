<template>
  <div class="page content">
    <v-row>
      <v-column col-12 col-lg-10>
        <div v-if="recipe" class="recipe">
          <v-row class="wide-gap">
            <v-column col-12 col-lg-5 v-if="recipe.coverImage">
              <blurrable-image :img="recipe.coverImage" />
            </v-column>
            <v-column col-12 col-lg-7>
              <v-row>
                <h1>{{ recipe.title }}</h1>
              </v-row>
              <v-row>
                <div class="recipe__duration">
                  <span v-if="totalDuration"
                    >Total <b>{{ totalDuration }}</b></span
                  >
                  <span v-if="recipe.preparationDuration"
                    >Preparation <b>{{ formatMinutesAsDuration(recipe.preparationDuration) }}</b></span
                  >
                  <span v-if="recipe.cookingDuration"
                    >Cooking <b>{{ formatMinutesAsDuration(recipe.cookingDuration) }}</b></span
                  >
                  <span v-if="recipe.customDuration"
                    >{{ recipe.customDurationName }} <b>{{ formatMinutesAsDuration(recipe.customDuration) }}</b></span
                  >
                </div>
              </v-row>
              <v-row>
                <div class="recipe__tags">
                  <v-tag>{{ recipe.category }}</v-tag>
                  <v-tag>{{ recipe.cuisine }}</v-tag>
                  <v-tag v-for="tag in recipe.tags" :key="tag">{{ tag }}</v-tag>
                </div>
              </v-row>
            </v-column>
          </v-row>
          <v-row class="wide-gap">
            <v-column col-12 col-lg-5>
              <div v-if="recipe.ingredientGroups.length > 0" class="recipe__ingredients">
                <div class="recipe__ingredients-title">
                  <h2>Ingredients</h2>
                  <div class="recipe__multiplier">
                    <a :class="{ disabled: ingredientMultiplier <= 1 }" @click="decreaseMultiplier">-</a>
                    <h4>{{ ingredientMultiplier }}</h4>
                    <a @click="increaseMultiplier">+</a>
                  </div>
                </div>
                <div v-for="ingredientSection in recipe.ingredientGroups" :key="JSON.stringify(ingredientSection)">
                  <span v-if="ingredientSection.name">
                    <b>{{ ingredientSection.name }}</b>
                  </span>
                  <ul>
                    <li v-for="ingredient in ingredientSection.ingredients" :key="JSON.stringify(ingredient)">
                      <span>
                        {{ adjustIngredientByMultiplier(ingredient.amount) }} {{ ingredient.unit }}
                        {{ ingredient.name }}</span
                      >
                      <span v-if="ingredient.note" class="text-muted"
                        ><i>&nbsp;{{ ingredient.note }}</i></span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </v-column>
            <v-column col-12 col-lg-7>
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
                    <div
                      v-for="(instruction, index) in instructionSection.instructions"
                      :key="JSON.stringify(instruction)"
                      class="instruction"
                    >
                      <h4>{{ index + 1 }}</h4>
                      <div v-html="instruction.label" />
                      <blurrable-image v-if="instruction.image" :img="instruction.image" />
                    </div>
                  </div>
                </div>
              </div>
            </v-column>
          </v-row>
          <v-row v-if="recipe.note" class="wide-gap">
            <v-column>
              <h2>Notes</h2>
              <div v-html="recipe.note" />
            </v-column>
          </v-row>
        </div>
      </v-column>
      <v-column col-12 col-lg-2>
<!--        <div v-if="relatedRecipes && relatedRecipes.length > 0">-->
<!--          <recipe-preview v-for="preview in relatedRecipes" :key="preview.title" :title="preview.title" />-->
<!--        </div>-->
      </v-column>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import Fraction from "fraction.js";
import { RecipeMapper } from "~/mapping/recipeMapper";
import { useDirectus } from "~/composables/useDirectus";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

const recipesResponse = await useAsyncData(() => {
  const client = useDirectus();
  const route = useRoute();

  return client.getRecipe(route.params.slug.toString());
});

if (!recipesResponse.data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found!",
  });
}
const recipe = ref(RecipeMapper.toClientRecipe(recipesResponse.data.value!));

const ingredientMultiplier = ref<number>(
  recipe.value.servings && recipe.value.servings > 0 ? recipe.value.servings : 1,
);
const numberOfServings = ingredientMultiplier.value;

function adjustIngredientByMultiplier(amount: Fraction) {
  if (!amount) {
    return "";
  }
  return amount.mul(ingredientMultiplier.value).div(numberOfServings).toFraction(true);
}
function increaseMultiplier() {
  ingredientMultiplier.value++;
}
function decreaseMultiplier() {
  if (ingredientMultiplier.value > 1) {
    ingredientMultiplier.value--;
  }
}

const totalDuration = computed(() => {
  return formatMinutesAsDuration(
    (recipe.value.preparationDuration ?? 0) + (recipe.value.cookingDuration ?? 0) + (recipe.value.customDuration ?? 0),
  );
});
function formatMinutesAsDuration(seconds: number) {
  dayjs.extend(duration);
  const totalDuration = dayjs.duration(seconds, "seconds");

  const formatStrings = [];
  if (totalDuration.asDays() >= 1) {
    formatStrings.push("D[d]");
  }
  if (totalDuration.asHours() >= 1) {
    formatStrings.push("H[h]");
  }
  if (totalDuration.asMinutes() >= 1) {
    formatStrings.push("m[m]");
  }
  return totalDuration.format(formatStrings.join(" "));
}
</script>

<style lang="scss" scoped>
@use "../../styles/mixins" as m;
.instruction-group {
  display: flex;
  flex-direction: column;
}
.instruction {
  display: flex;
  @include m.spacing("gx", "sm");
  > h4 {
    margin: 0;
  }
}
</style>

<style lang="scss">
.instruction {
  p {
    margin-top: 0;
  }
}
</style>
