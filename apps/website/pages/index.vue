<script setup lang="ts">
import { css } from "styled-system/css";
import { grid } from "styled-system/patterns";
import { token } from "styled-system/tokens";

import { throwIfNil } from "~/utils/error";

const { data: content } = await useFetch("/api/content/home");
const { data: recipes } = await useFetch("/api/featured-recipes");

throwIfNil(content.value, "Failed to fetch content.");
throwIfNil(recipes.value, "Failed to fetch recipes.");

const { favourite, latest, quick, worldCuisine } = recipes.value!;

if (import.meta.prerender) {
  useSeoMeta({
    title: content.value.title,
    ogTitle: content.value.title,
    description: content.value.description,
    ogDescription: content.value.openGraphDescription,
  });
}

useHead({
  title: content.value.title,
});

const sectionTitleRowCss = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  "& h2": {
    marginBottom: 0,
  },
  "& span": {
    verticalAlign: "middle",
  },
});

const cardGroupCss = grid({
  columnGap: "sm",
  columns: {
    base: 1,
    md: 3,
  },
  rowGap: "md",
  marginTop: "sm",
});

const linkCss = css({
  color: token("colors.font"),
  transition: "translate 0.2s ease-in-out",

  _active: {
    transform: "translateY(0px)",
  },
  _canHover: {
    _hover: {
      color: token("colors.primary"),
      borderColor: token("colors.primary"),
      transform: "translateY(-1px)",
    },
  },
});
</script>

<template>
  <div :class="css({ display: 'flex', flexDirection: 'column', rowGap: 'xl' })">
    <section>
      <div :class="sectionTitleRowCss">
        <Text is="h2" size="xxxl">Latest Recipes</Text>
        <NuxtLink :class="linkCss" to="/recipes" aria-label="See all recipes">
          <Text>More recipes</Text>
          <icon name="mynaui:chevron-right" :size="24" />
        </NuxtLink>
      </div>

      <GradientFeatureRecipeGrid :promo="latest.promo!" :side-recipes="latest.recipes" />
    </section>

    <section>
      <div :class="sectionTitleRowCss">
        <Text is="h2" size="xxxl">Personal Favourites</Text>
      </div>

      <div :class="cardGroupCss">
        <RecipeCard
          v-for="recipe in favourite.recipes"
          :description="recipe.descriptionSnippet"
          :duration="recipe.durationTotal?.text"
          :image="recipe.previewImage"
          :key="recipe.slug"
          :tag="recipe.featuredTag"
          :title="recipe.title"
          :to="`/recipes/${recipe.slug}`"
          lazy-load-image
        />
      </div>
    </section>

    <section>
      <div :class="sectionTitleRowCss">
        <Text is="h2" size="xxxl">Quick Eats</Text>
      </div>

      <SplitRecipeGrid :promo="quick.promo" :side-recipes="quick.recipes" />
    </section>

    <section>
      <div :class="sectionTitleRowCss">
        <Text is="h2" size="xxxl">World Cuisines</Text>
      </div>

      <div :class="cardGroupCss">
        <RecipeCard
          v-for="recipe in worldCuisine.recipes"
          :description="recipe.descriptionSnippet"
          :duration="recipe.durationTotal?.text"
          :image="recipe.previewImage"
          :key="recipe.slug"
          :tag="recipe.featuredTag"
          :title="recipe.title"
          :to="`/recipes/${recipe.slug}`"
          lazy-load-image
        />
      </div>
    </section>
  </div>
</template>
