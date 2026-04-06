<template>
  <div class="recipe">
    <blurrable-image :img="recipe.coverImage" purpose="cover" shape="portrait" />
    <div class="recipe__summary">
      <h1 class="recipe__title">{{ recipe.title }}</h1>
      <div v-if="recipe.description" class="recipe__description" v-html="recipe.description" />
      <div class="recipe__tags">
        <a
          v-for="tag in recipe.tags"
          :key="tag"
          :href="createSearchLink(tag)"
          class="concealed"
          @click.prevent="onSearchTagClick(tag)"
        >
          <v-tag icon-name="mynaui:search">{{ tag }}</v-tag>
        </a>
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
          <template
            v-for="ingredient in ingredientSection.ingredients"
            :key="ingredient.name.singular"
          >
            <li v-if="!ingredient.inlineOnly">
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
              shape="square"
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
      <img src="/icons/logo-light.svg" alt="Wizard Food" width="140" class="light-theme-only" />
      <img src="/icons/logo-dark.svg" alt="Wizard Food" width="140" class="dark-theme-only" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { navigate } from "astro:transitions/client";
import type { RecipePayload } from "@wizard/content/store";

import { formatRecipeDurations } from "@/utils/formatting";
import VTag from "@/components/VTag.vue";
import VPopover from "@/components/VPopover.vue";
import VBadge from "@/components/VBadge.vue";
import ServingsAdjuster from "@/components/ServingsAdjuster.vue";
import RecipeInstruction from "@/components/RecipeInstruction.vue";
import RecipeIngredient from "@/components/RecipeIngredient.vue";
import BlurrableImage from "@/components/BlurrableImage.vue";

const props = defineProps<{
  recipe: RecipePayload;
}>();

const durationLabels = computed(() => formatRecipeDurations(props.recipe));

const servings = ref<number>(
  props.recipe.servings && props.recipe.servings > 0 ? props.recipe.servings : 1,
);
const originalNumberOfServings = servings.value;

function updateNumberOfServings(newServings: number) {
  servings.value = newServings;
}

function createSearchLink(term: string): string {
  const query = new URLSearchParams({ search: term.trim() });
  return `/recipes?${query.toString()}`;
}

function onSearchTagClick(term: string) {
  void navigate(createSearchLink(term));
}
</script>

<style lang="scss" scoped>
@use "../../styles/mixins" as m;
@use "../../styles/variables" as v;

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
    grid-column: 1 / -1;
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
  grid-column: 1 / -1;
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
