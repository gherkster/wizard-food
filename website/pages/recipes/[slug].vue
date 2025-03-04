<template>
  <div v-if="recipe" class="recipe">
    <blurrable-image :img="recipe.coverImage" purpose="cover" aspect-ratio="portrait" />
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
        <div v-if="durationLabels.total" class="recipe__duration">
          <v-popover>
            <template #trigger>
              <span
                >Total <b>{{ durationLabels.total }}</b></span
              >
            </template>
            <template #content>
              <ul>
                <li v-if="durationLabels.preparation">
                  <span
                    >Preparation <b>{{ durationLabels.preparation }}</b></span
                  >
                </li>
                <li v-if="durationLabels.cooking">
                  <span
                    >Cooking <b>{{ durationLabels.cooking }}</b></span
                  >
                </li>
                <li v-if="recipe.customDurationName && durationLabels.custom">
                  <span>
                    {{ recipe.customDurationName }}
                    <b>{{ durationLabels.custom }}</b></span
                  >
                </li>
              </ul>
            </template>
          </v-popover>
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
    <div v-if="recipe.ingredientGroups.length > 0" class="recipe__ingredients highlight-container">
      <div class="recipe__ingredients-title">
        <h2>Ingredients</h2>
      </div>
      <div v-for="ingredientSection in recipe.ingredientGroups" :key="JSON.stringify(ingredientSection)">
        <p v-if="ingredientSection.name">
          <b>{{ ingredientSection.name }}</b>
        </p>
        <ul>
          <template v-for="ingredient in ingredientSection.ingredients">
            <li v-if="!ingredient.inlineOnly" :key="JSON.stringify(ingredient)">
              <recipe-ingredient
                :ingredient="ingredient"
                :ingredient-multiplier="servings"
                :original-number-of-servings="originalNumberOfServings"
                :unit-forms="unitForms"
              />
            </li>
          </template>
        </ul>
      </div>
    </div>
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
    <div v-if="recipe.note" class="recipe__notes">
      <h2>Notes</h2>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="recipe.note" />
    </div>
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

const formatter = useRecipeFormatter();
const durationLabels = computed(() => formatter.formatRecipeDurations(recipe.value));

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
useJsonld({
  "@context": "https://schema.org",
  "@type": "Recipe",
  name: recipe.value.title,
  description: recipe.value.descriptionSnippet,
  image: image.buildExternalUrl({
    imageId: recipe.value.coverImage.id,
    modifyDate: recipe.value.coverImage.modifyDate,
    purpose: "cover",
    aspectRatio: "square",
  }),
  recipeCategory: recipe.value.course,
  recipeCuisine: recipe.value.cuisine,
  recipeYield:
    recipe.value.servings && recipe.value.servingsType
      ? `${recipe.value.servings} ${recipe.value.servingsType}`
      : undefined,
  keywords: recipe.value.tags.filter((t) => t !== recipe.value.course && t !== recipe.value.cuisine).join(", "),
  totalTime: formatter.recipeTotalDuration(recipe.value).toISOString(),
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
  display: grid;
  @include m.spacing("gx", "lg");
  @include m.spacing("gy", "md");

  @include m.breakpoint("md") {
    grid-template-columns: 5fr 7fr;
  }
  @include m.breakpoint("lg") {
    grid-template-columns: 4fr 8fr;
  }

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
    text-transform: capitalize;

    @include m.spacing("g", "xs");
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
  &__notes {
    grid-column: 1 / -1; // Full width
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
  height: fit-content;
  background-color: var(--theme-body-accent-color);
  border-radius: v.$border-radius-sm;

  @include m.spacing("p", "sm");
}

footer {
  display: flex;
  justify-content: center;
  grid-column: 1 / -1; // Full width
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
