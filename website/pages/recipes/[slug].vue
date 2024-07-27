<template>
  <div v-if="recipe" class="recipe">
    <v-row class="wide-gap">
      <v-column v-if="recipe.coverImage" col-12 col-md-5 col-lg-4>
        <blurrable-image :img="recipe.coverImage" purpose="cover" aspect-ratio="portrait" />
      </v-column>
      <v-column col-12 col-md-7 col-lg-8>
        <div class="recipe__summary">
          <h1 class="recipe__title">{{ recipe.title }}</h1>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-if="recipe.description" class="recipe__description" v-html="recipe.description" />
          <div class="recipe__tags">
            <nuxt-link v-for="tag in recipe.tags" :key="tag" :to="createSearchLink(tag)" class="concealed">
              <v-tag :icon="magnifier">{{ tag }}</v-tag>
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
      <v-column col-12 col-md-5 col-lg-4>
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
                <recipe-ingredient
                  :ingredient="ingredient"
                  :ingredient-multiplier="servings"
                  :original-number-of-servings="originalNumberOfServings"
                  :unit-forms="unitForms"
                />
              </li>
            </ul>
          </div>
        </div>
      </v-column>
      <v-column col-12 col-md-7 col-lg-8>
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
                  :unit-forms="unitForms"
                />
                <blurrable-image
                  v-if="instruction.image"
                  :img="instruction.image"
                  purpose="instruction"
                  aspect-ratio="square"
                />
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
    <footer class="footer">
      <v-icon :icon="logoLight" :size="140" class="light-theme-only" />
      <v-icon :icon="logoDark" :size="140" class="dark-theme-only" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRecipeFormatter } from "~/composables";
import type { Recipe } from "~/types/recipe";
import type { RouteLocationRaw } from "#vue-router";
import logoLight from "~icons/custom/logo-light";
import logoDark from "~icons/custom/logo-dark";
import magnifier from "~icons/gravity-ui/magnifier";
import type { IngredientUnitForm } from "~/types/mapping";

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

const image = useImage();
useServerSeoMeta({
  title: recipe.value.title,
  ogTitle: recipe.value.title,
  description: recipe.value.descriptionPlainText,
  ogDescription: recipe.value.descriptionSnippet,
  ogImage: image.buildExternalUrl({
    imageId: recipe.value.coverImage.id,
    modifyDate: recipe.value.coverImage.modifyDate,
    purpose: "cover",
    aspectRatio: "square",
  }),
});
useHead({
  title: recipe.value.title,
});

const servings = ref<number>(recipe.value.servings && recipe.value.servings > 0 ? recipe.value.servings : 1);
const originalNumberOfServings = servings.value;

function updateNumberOfServings(newServings: number) {
  servings.value = newServings;
}

const unitFormsResponse = await useAsyncData("ingredientUnitVariants", async () => {
  const { data: mapping } = await useFetch<IngredientUnitForm[]>("/api/mapping/ingredientUnitVariants");
  return mapping.value;
});
const unitForms = unitFormsResponse.data.value ?? [];

const formatter = useRecipeFormatter();
const totalDuration = computed(() => {
  const sumDuration =
    (recipe.value.preparationDuration ?? 0) +
    (recipe.value.cookingDuration ?? 0) +
    (recipe.value.customDuration && recipe.value.customDurationName ? recipe.value.customDuration : 0);

  if (sumDuration === 0) {
    return "";
  }

  return formatter.formatMinutesAsDuration(sumDuration);
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
  @include m.spacing("g", "md");
  &__summary {
    display: flex;
    flex-direction: column;
    @include m.spacing("gy", "md");
  }
  &__title {
    margin: 0;
  }
  &__details {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-top: auto;
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
  background-color: var(--theme-body-highlight-color);
  border-radius: v.$border-radius-sm;
  @include m.spacing("p", "sm");
}

footer {
  display: flex;
  justify-content: center;
  @include m.spacing("mt", "md");
  @include m.spacing("mb", "lg");
}
</style>

<style lang="scss">
.recipe__ingredient {
  &__name {
    p {
      display: inline;
      margin: 0;
    }
  }
}
</style>
