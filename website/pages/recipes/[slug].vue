<template>
  <div class="content">
    <div v-if="recipe" class="recipe">
      <v-row class="wide-gap">
        <v-column v-if="recipe.coverImage" col-12 col-lg-4>
          <blurrable-image :img="recipe.coverImage" purpose="cover" />
        </v-column>
        <v-column col-12 col-lg-8>
          <div class="recipe__summary">
            <h1 class="recipe__title">{{ recipe.title }}</h1>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-if="recipe.description" class="recipe__description" v-html="recipe.description" />
            <div class="recipe__tags">
              <nuxt-link v-for="tag in recipe.tags" :key="tag" :to="createSearchLink(tag)">
                <v-tag>{{ tag }}</v-tag>
              </nuxt-link>
            </div>
            <div class="recipe__details highlight-container">
              <div class="recipe__duration">
                <span v-if="totalDuration"
                  >Total <b>{{ totalDuration }}</b></span
                >
                <!-- <span v-if="recipe.preparationDuration"
                  >Preparation <b>{{ formatter.formatMinutesAsDuration(recipe.preparationDuration) }}</b></span
                >
                <span v-if="recipe.cookingDuration"
                  >Cooking <b>{{ formatter.formatMinutesAsDuration(recipe.cookingDuration) }}</b></span
                >
                <span v-if="recipe.customDuration && recipe.customDurationName">
                  {{ recipe.customDurationName }}
                  <b>{{ formatter.formatMinutesAsDuration(recipe.customDuration) }}</b></span
                > -->
              </div>
              <div class="recipe__options">
                <servings-adjuster
                  :label="recipe.servingsType"
                  :servings="servings"
                  class="recipe__multiplier"
                  @input="updateNumberOfServings"
                />
              </div>
            </div>
          </div>
        </v-column>
      </v-row>
      <v-row class="wide-gap">
        <v-column col-12 col-lg-4>
          <div v-if="recipe.ingredientGroups.length > 0" class="recipe__ingredients highlight-container">
            <div class="recipe__ingredients-title">
              <h2>Ingredients</h2>
            </div>
            <div v-for="ingredientSection in recipe.ingredientGroups" :key="JSON.stringify(ingredientSection)">
              <p v-if="ingredientSection.name">
                <b>{{ ingredientSection.name }}</b>
              </p>
              <ul>
                <li v-for="ingredient in ingredientSection.ingredients" :key="JSON.stringify(ingredient)">
                  <span v-if="ingredient.amount">{{ adjustIngredientByMultiplier(ingredient.amount) }}&nbsp;</span>
                  <span v-if="ingredient.unit">{{ ingredient.unit }}&nbsp;</span>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span class="recipe__ingredient__name" v-html="ingredient.name" />
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
                  <blurrable-image v-if="instruction.image" :img="instruction.image" purpose="instruction" />
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
import { useRecipeFormatter } from "~/composables";
import type { Recipe } from "~/types/recipe";
import type { RouteLocationRaw } from "#vue-router";

const route = useRoute();
const recipesResponse = await useAsyncData(route.params.slug.toString(), async () => {
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

const formatter = useRecipeFormatter();
const totalDuration = computed(() => {
  return formatter.formatMinutesAsDuration(
    (recipe.value.preparationDuration ?? 0) +
      (recipe.value.cookingDuration ?? 0) +
      (recipe.value.customDuration && recipe.value.customDurationName ? recipe.value.customDuration : 0),
  );
});

function createSearchLink(term: string): RouteLocationRaw {
  return {
    path: "/recipes",
    query: {
      search: term.trim(),
    },
  };
}
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;

.recipe {
  display: flex;
  flex-direction: column;
  @include m.spacing("g", "sm");
  &__summary {
    display: flex;
    flex-direction: column;
    @include m.spacing("gy", "sm");
  }
  &__title {
    margin: 0;
  }
  &__details {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  &__tags {
    display: flex;
    flex-wrap: wrap;
    @include m.spacing("g", "xs");
  }
  &__duration {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    @include m.spacing("g", "xs");
    text-transform: capitalize;
  }
  &__ingredients {
    display: flex;
    flex-direction: column;
    &-title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
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

.highlight-container {
  display: flex;
  background-color: v.$colour-bg-highlight;
  border-radius: v.$border-radius-sm;
  @include m.spacing("p", "sm");
}
</style>

<style lang="scss">
.recipe__description {
  p {
    margin: 0;
  }
}
.recipe__ingredient {
  &__name {
    p {
      display: inline-block;
      margin: 0;
    }
  }
}
.instruction {
  p {
    margin-top: 0;
  }
}
</style>
