<script setup lang="ts">
import type { SingularPluralPair } from "@wizard/content";
import { css, type Styles } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { token } from "styled-system/tokens";

import { useSearch, type Facets } from "~/composables/useSearch";
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

const tagFilters: Facets = {
  course: [recipe.value.course],
  cuisine: [recipe.value.cuisine],
  diets: recipe.value.diets?.map((d) => d) ?? [],
};

const { createFilterSearchLink } = useSearch();

const tags = Object.entries(tagFilters).flatMap(([facetKey, facetValues]) => {
  return facetValues.map((facetValue) => {
    return {
      value: facetValue,
      link: createFilterSearchLink({ [facetKey]: facetValue }),
    };
  });
});

if (import.meta.server) {
  useSeoMeta({
    title: recipe.value.title,
    ogTitle: recipe.value.title,
    description: recipe.value.descriptionPlainText,
    ogDescription: recipe.value.descriptionSnippet,
    ogImage: recipe.value.coverImage.src,
  });

  const formatYield = (servings: number, type: SingularPluralPair) => {
    if (!servings) {
      return undefined;
    }

    return servings > 1 ? `${servings} ${type.plural}` : `${servings} ${type.singular}`;
  };

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
    recipeYield: formatYield(recipe.value.servings, recipe.value.servingsType),
    keywords: tags
      .map((t) => t.value)
      .filter((t) => t !== recipe.value!.course && t !== recipe.value!.cuisine)
      .join(", "),
    totalTime: recipe.value.durationTotal?.isoDuration,
  });
}

useHead({
  title: recipe.value.title,
});

const selectedServings = ref<number>(
  recipe.value.servings && recipe.value.servings > 0 ? recipe.value.servings : 1,
);

const originalServings = selectedServings.value;

const highlightContainerStyles: Styles = {
  display: "flex",
  height: "fit-content",
  backgroundColor: token("colors.surface"),
  borderRadius: "sm",
  borderWidth: "2px",
  borderColor: token("colors.border"),
  padding: "sm",
};

const tagLinkCss = css({
  color: token("colors.font"),
  transition: "translate 0.2s ease-in-out",

  _active: {
    transform: "translateY(0px)",
  },
  _canHover: {
    _hover: {
      color: token("colors.primary"),
      borderColor: token("colors.primary"),
      transform: "translateY(-2px)",
    },
  },
});
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
    <Image :class="css({ borderRadius: 'sm' })" :image="recipe.coverImage" fetch-priority="high" />

    <div :class="css({ display: 'flex', flexDirection: 'column', rowGap: '1em' })">
      <h1 :class="css({ margin: 0, textWrapStyle: 'auto' })">{{ recipe.title }}</h1>

      <div :class="css({ display: 'flex', flexWrap: 'wrap', gap: 'xs' })">
        <NuxtLink v-for="tag in tags" :class="tagLinkCss" :to="tag.link">
          <Tag icon-name="mynaui:search">{{ tag.value }}</Tag>
        </NuxtLink>
      </div>

      <div v-if="recipe.description" v-html="recipe.description" />

      <Divider />

      <div
        :class="
          css({
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            px: {
              base: 'xs',
              lg: 0,
            },
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
          :servings="selectedServings"
          :singular-label="recipe.servingsType?.singular"
          :plural-label="recipe.servingsType?.plural"
          @input="(value) => (selectedServings = value)"
        />
      </div>

      <Divider />
    </div>

    <HeightAwareSticky v-if="recipe.ingredientGroups.length > 0" :offset="48">
      <RecipeIngredients
        :class="css(highlightContainerStyles, { display: 'flex', flexDirection: 'column' })"
        :ingredient-groups="recipe.ingredientGroups"
        :selected-servings="selectedServings"
        :original-servings="originalServings"
      />
    </HeightAwareSticky>

    <RecipeInstructions
      v-if="recipe.instructionGroups.length > 0"
      :class="css({ py: 'sm' })"
      :instruction-groups="recipe.instructionGroups"
      :selected-servings="selectedServings"
      :original-servings="originalServings"
    />

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
