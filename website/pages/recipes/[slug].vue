<template>
  <div class="content">
    <div v-if="recipe" class="recipe">
      <v-row class="wide-gap">
        <v-column v-if="recipe.coverImage" col-12 col-lg-4>
          <blurrable-image :img="recipe.coverImage" />
        </v-column>
        <v-column col-12 col-lg-8>
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
        <v-column col-12 col-lg-4>
          <div v-if="recipe.ingredientGroups.length > 0" class="recipe__ingredients">
            <div class="recipe__ingredients-title">
              <h2>Ingredients</h2>
            </div>
            <div class="recipe__options">
              <div class="recipe__multiplier">
                <span>Servings</span>
                <servings-adjuster :servings="servings" @input="updateNumberOfServings" />
              </div>
              <div class="recipe__units">
                <v-switch v-model="unitType" :options="['Metric', 'US']" />
              </div>
            </div>
            <v-divider />
            <div v-for="ingredientSection in recipe.ingredientGroups" :key="JSON.stringify(ingredientSection)">
              <p v-if="ingredientSection.name">
                <b>{{ ingredientSection.name }}</b>
              </p>
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
        <v-column col-12 col-lg-8>
          <div v-if="recipe.instructionGroups.length > 0" class="recipe__instructions">
            <h2>Instructions</h2>
            <div
              v-for="instructionSection in recipe.instructionGroups"
              :key="JSON.stringify(instructionSection)"
              class="instruction-section"
            >
              <p v-if="instructionSection.name">
                <b>{{ instructionSection.name }}</b>
              </p>
              <div class="instruction-group">
                <div
                  v-for="(instruction, index) in instructionSection.instructions"
                  :key="JSON.stringify(instruction)"
                  class="instruction"
                >
                  <v-badge>{{ index + 1 }}</v-badge>
                  <recipe-instruction
                    :content="instruction.text"
                    :ingredient-multiplier="servings"
                    :original-number-of-servings="originalNumberOfServings"
                  />
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
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="recipe.note" />
        </v-column>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import type { Recipe } from "~/types/recipe";

const recipesResponse = await useAsyncData(async () => {
  const route = useRoute();

  const { data: recipe } = await useFetch<Recipe>(`/api/recipes/${route.params.slug.toString()}`);
  return recipe.value;
});

if (recipesResponse.error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: recipesResponse.error.value?.message,
  });
}

if (!recipesResponse.data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found!",
  });
}
const recipe = ref(recipesResponse.data.value);

const servings = ref<number>(recipe.value.servings && recipe.value.servings > 0 ? recipe.value.servings : 1);
const originalNumberOfServings = servings.value;

const multipler = useIngredientMultiplier();
function adjustIngredientByMultiplier(amount?: number) {
  if (!amount) {
    return "";
  }
  return multipler.multiplyToFraction(amount, servings.value, originalNumberOfServings);
}
function updateNumberOfServings(newServings: number) {
  servings.value = newServings;
}

const unitType = ref<"Metric" | "US">("Metric");

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
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;

.recipe {
  &__tags {
    display: flex;
    flex-wrap: wrap;
    @include m.spacing("g", "xs");
  }
  &__duration {
    display: flex;
    flex-wrap: wrap;
    @include m.spacing("g", "xs");
  }
  &__ingredients {
    display: flex;
    flex-direction: column;
    background-color: v.$colour-primary;
    border-radius: v.$border-radius-sm;
    @include m.spacing("p", "sm");
    &-title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
  &__instructions {
    @include m.spacing("py", "sm");
  }
  &__options {
    display: flex;
    justify-content: space-between;
    align-items: end;
  }
  &__multiplier {
    display: flex;
    flex-direction: column;
    align-items: center;
    @include m.spacing("gy", "xxs");
  }
  ul,
  ol {
    @include m.spacing("pl", "xs");
  }
}

.instruction-group {
  display: flex;
  flex-direction: column;
  @include m.spacing("gy", "xs");
}
.instruction {
  display: flex;
  @include m.spacing("gx", "xs");
}
</style>

<style lang="scss">
.instruction {
  p {
    margin-top: 0;
  }
}
</style>
