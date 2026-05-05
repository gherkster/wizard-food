<script setup lang="ts">
import { css, type Styles } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { token } from "styled-system/tokens";

import type { RouteLocationRaw } from "#vue-router";
import { useJsonld } from "~/utils/jsonld";

const route = useRoute();
const slug = route.params.slug!.toString();

const { data: recipe } = await useFetch(`/api/recipes/${slug}`);

if (!recipe.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found!",
  });
}

if (import.meta.server) {
  useSeoMeta({
    title: recipe.value.title,
    ogTitle: recipe.value.title,
    description: recipe.value.descriptionPlainText,
    ogDescription: recipe.value.descriptionSnippet,
    ogImage: recipe.value.coverImage.src,
  });

  useJsonld({
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.value.title,
    description: recipe.value.descriptionSnippet,
    image: recipe.value.coverImage.src,
    // Ingredients and instructions are not included, as that would require including both rich text and plain text variants of strings,
    // which is not worth increasing the payload size over a minimal feature
    recipeCategory: recipe.value.course,
    recipeCuisine: recipe.value.cuisine,
    recipeYield:
      recipe.value.servings && recipe.value.servingsType
        ? `${recipe.value.servings} ${recipe.value.servingsType}`
        : undefined,
    keywords: recipe.value.tags
      .filter((t) => t !== recipe.value!.course && t !== recipe.value!.cuisine)
      .join(", "),
    totalTime: recipe.value.durationTotal?.isoDuration,
  });
}

useHead({
  title: recipe.value.title,
});

const servings = ref<number>(
  recipe.value.servings && recipe.value.servings > 0 ? recipe.value.servings : 1,
);
const originalNumberOfServings = servings.value;

function updateNumberOfServings(newServings: number) {
  servings.value = newServings;
}

const createSearchLink = (term: string): RouteLocationRaw => {
  return {
    path: "/recipes",
    query: {
      search: term.trim(),
    },
  };
};

const highlightContainerStyles: Styles = {
  display: "flex",
  height: "fit-content",
  backgroundColor: token("colors.surface"),
  borderRadius: "sm",
  borderWidth: "1px",
  borderColor: token("colors.border"),
  padding: "sm",
};
</script>

<template>
  <div
    v-if="recipe"
    :class="
      grid({
        gridTemplateColumns: {
          base: '1fr',
          sm: '5fr 7fr',
          md: '4fr 8fr',
        },
        columnGap: 'lg',
        rowGap: 'md',
      })
    "
  >
    <Image :image="recipe.coverImage" />

    <div :class="css({ display: 'flex', flexDirection: 'column', rowGap: '1em' })">
      <h1 :class="css({ margin: 0, textWrapStyle: 'auto' })">{{ recipe.title }}</h1>

      <div :class="css({ display: 'flex', flexWrap: 'wrap', gap: 'xs' })">
        <HoverLink v-for="tag in recipe.tags" :key="tag" :to="createSearchLink(tag)">
          <Tag icon-name="mynaui:search">{{ tag }}</Tag>
        </HoverLink>
      </div>

      <div v-if="recipe.description" v-html="recipe.description" />

      <Divider />

      <div
        :class="
          css({
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          })
        "
      >
        <div
          v-if="recipe.durationTotal"
          :class="
            css({
              hideFrom: 'lg', // Hide the popover using a parent container, since targeting the popover directly with panda css doesn't hide it
            })
          "
        >
          <Popover>
            <template #trigger>
              <RecipeDuration
                :label="recipe.durationTotal.label"
                :value="recipe.durationTotal.text"
              />
            </template>

            <div :class="css({ display: 'flex', flexDirection: 'column', gap: '0.5em' })">
              <RecipeDuration
                v-for="duration in recipe.durationComponents"
                :label="duration.label"
                :value="duration.text"
              />
            </div>
          </Popover>
        </div>

        <RecipeDuration
          v-if="recipe.durationTotal"
          :class="
            css({
              hideBelow: 'lg',
            })
          "
          :label="recipe.durationTotal.label"
          :value="recipe.durationTotal.text"
        />

        <RecipeDuration
          v-for="duration in recipe.durationComponents"
          :class="
            css({
              hideBelow: 'lg',
            })
          "
          :label="duration.label"
          :value="duration.text"
        />

        <ServingsAdjuster
          :servings="servings"
          :singular-label="recipe.servingsType?.singular"
          :plural-label="recipe.servingsType?.plural"
          @input="updateNumberOfServings"
        />
      </div>

      <Divider />
    </div>

    <div
      v-if="recipe.ingredientGroups.length > 0"
      :class="css(highlightContainerStyles, { display: 'flex', flexDirection: 'column' })"
    >
      <h2>Ingredients</h2>

      <div :class="css({ display: 'flex', flexDirection: 'column', rowGap: '1.2em' })">
        <div
          v-for="ingredientSection in recipe.ingredientGroups"
          :key="`${ingredientSection.name}-${ingredientSection.ingredients.length}`"
        >
          <Text
            v-if="ingredientSection.name"
            size="lg"
            weight="bold"
            is="div"
            :class="css({ mb: '0.5em' })"
          >
            {{ ingredientSection.name }}
          </Text>

          <ul :class="css({ listStyle: 'inside' })">
            <template v-for="ingredient in ingredientSection.ingredients">
              <li v-if="!ingredient.inlineOnly" :key="ingredient.name.singular">
                <RecipeIngredient
                  :ingredient="ingredient"
                  :ingredient-multiplier="servings"
                  :original-number-of-servings="originalNumberOfServings"
                />
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="recipe.instructionGroups.length > 0" :class="css({ py: 'sm' })">
      <h2>Instructions</h2>

      <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'sm' })">
        <div
          v-for="instructionSection in recipe.instructionGroups"
          :key="`${instructionSection.name}-${instructionSection.instructions.length}`"
        >
          <Text
            v-if="instructionSection.name"
            size="lg"
            weight="bold"
            is="div"
            :class="css({ mb: '0.5em' })"
          >
            {{ instructionSection.name }}
          </Text>

          <div :class="css({ display: 'flex', flexDirection: 'column', rowGap: '1.2em' })">
            <div
              v-for="(instruction, index) in instructionSection.instructions"
              :key="instruction.text"
              :class="css({ display: 'flex', columnGap: 'xs' })"
            >
              <VBadge>{{ index + 1 }}</VBadge>
              <RecipeInstruction
                :content="instruction.text"
                :ingredient-multiplier="servings"
                :original-number-of-servings="originalNumberOfServings"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="recipe.note"
      :class="
        css(highlightContainerStyles, {
          display: 'flex',
          flexDirection: 'column',
          gridColumn: '1 / -1',
        })
      "
    >
      <h2>Notes</h2>
      <div v-html="recipe.note" />
    </div>

    <footer
      :class="
        css({ display: 'flex', justifyContent: 'center', gridColumn: '1 / -1', mt: 'md', mb: 'lg' })
      "
    >
      <icon
        name="wf:logo-light"
        :size="140"
        :class="
          css({
            display: { base: 'block !important', _osDark: 'none !important' },
          })
        "
      />
      <icon
        name="wf:logo-dark"
        :size="140"
        :class="
          css({
            display: { base: 'none !important', _osDark: 'block !important' },
          })
        "
      />
    </footer>
  </div>
</template>
