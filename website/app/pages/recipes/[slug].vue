<template>
  <div v-if="recipe" class="recipe">
    <blurrable-image :img="recipe.coverImage" purpose="cover" aspect-ratio="portrait" />
    <div class="recipe__summary">
      <h1 class="recipe__title">{{ recipe.title }}</h1>
      <div v-if="recipe.description" class="recipe__description" v-html="recipe.description" />
      <div class="recipe__tags">
        <nuxt-link
          v-for="tag in recipe.tags"
          :key="tag"
          :to="createSearchLink(tag)"
          class="concealed"
        >
          <v-tag icon-name="mynaui:search">{{ tag }}</v-tag>
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
            :servings="servings"
            :singular-label="recipe.servingsType?.singular"
            :plural-label="recipe.servingsType?.plural"
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
      <div
        v-for="ingredientSection in recipe.ingredientGroups"
        :key="`${ingredientSection.name}-${ingredientSection.ingredients.length}`"
      >
        <p v-if="ingredientSection.name">
          <b>{{ ingredientSection.name }}</b>
        </p>
        <ul>
          <template v-for="ingredient in ingredientSection.ingredients">
            <li v-if="!ingredient.inlineOnly" :key="ingredient.name.singular">
              <recipe-ingredient
                :ingredient="ingredient"
                :ingredient-multiplier="servings"
                :original-number-of-servings="originalNumberOfServings"
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
        :key="`${instructionSection.name}-${instructionSection.instructions.length}`"
        class="instruction-section"
      >
        <p v-if="instructionSection.name">
          <b>{{ instructionSection.name }}</b>
        </p>
        <div class="instruction-group">
          <div
            v-for="(instruction, index) in instructionSection.instructions"
            :key="instruction.text"
            class="instruction"
          >
            <v-badge>{{ index + 1 }}</v-badge>
            <recipe-instruction
              :content="instruction.text"
              :ingredient-multiplier="servings"
              :original-number-of-servings="originalNumberOfServings"
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
      <div v-html="recipe.note" />
    </div>
    <footer class="footer">
      <icon name="wf:logo-light" :size="140" class="light-theme-only" />
      <icon name="wf:logo-dark" :size="140" class="dark-theme-only" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from "#vue-router";

const route = useRoute();

const slug = route.params.slug!.toString();

const recipesResponse = await useAsyncData(
  slug,
  async () => {
    const { data: recipe } = await useFetch(`/api/recipes/${slug}`);

    if (!recipe.value) {
      throw `Recipe ${slug} could not be retrieved`;
    }

    return recipe.value;
  },
  {
    transform: mapToRecipe,
  },
);

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

const durationLabels = computed(() => formatRecipeDurations(recipe.value));

useHead({
  title: recipe.value.title,
});

const image = useImage();

if (import.meta.server) {
  useSeoMeta({
    title: recipe.value.title,
    ogTitle: recipe.value.title,
    description: recipe.value.descriptionPlainText,
    ogDescription: recipe.value.descriptionSnippet,
    ogImage: image.buildExternalUrl({
      id: recipe.value.coverImage.id,
      fileName: recipe.value.coverImage.fileName,
      modifyDate: recipe.value.coverImage.modifyDate,
      purpose: "cover",
      aspectRatio: "square",
    }),
  });

  useJsonld({
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.value.title,
    description: recipe.value.descriptionSnippet,
    image: image.buildExternalUrl({
      id: recipe.value.coverImage.id,
      fileName: recipe.value.coverImage.fileName,
      modifyDate: recipe.value.coverImage.modifyDate,
      purpose: "cover",
      aspectRatio: "square",
    }),
    // Ingredients and instructions are not included, as that would require including both rich text and plain text variants of strings,
    // which is not worth increasing the payload size over a minimal feature
    recipeCategory: recipe.value.course,
    recipeCuisine: recipe.value.cuisine,
    recipeYield:
      recipe.value.servings && recipe.value.servingsType
        ? `${recipe.value.servings} ${recipe.value.servingsType}`
        : undefined,
    keywords: recipe.value.tags
      .filter((t) => t !== recipe.value.course && t !== recipe.value.cuisine)
      .join(", "),
    totalTime: recipeTotalDuration(recipe.value).toISOString(),
  });
}

const servings = ref<number>(
  recipe.value.servings && recipe.value.servings > 0 ? recipe.value.servings : 1,
);
const originalNumberOfServings = servings.value;

function updateNumberOfServings(newServings: number) {
  servings.value = newServings;
}

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
