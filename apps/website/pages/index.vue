<script setup lang="ts">
import { css } from "styled-system/css";
import { grid } from "styled-system/patterns";

import { throwIfNil } from "~/utils/error";

const { data: content } = await useFetch("/api/content/home");
const { data: recipes } = await useFetch("/api/featured-recipes");

throwIfNil(content.value, "Failed to fetch content.");
throwIfNil(recipes.value, "Failed to fetch recipes.");

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

const sectionStyles = css({
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

const cardGroupStyles = grid({
  columns: {
    base: 2,
    md: 3,
    lg: 4,
  },
  gap: "sm",
  marginTop: "sm",
});
</script>

<template>
  <div :class="css({ display: 'flex', flexDirection: 'column', rowGap: 'lg' })">
    <section v-if="recipes!.latestRecipes.length > 0">
      <div :class="sectionStyles">
        <h2>Latest Recipes</h2>
        <HoverLink to="/recipes" aria-label="See all recipes">
          <Text>See more</Text>
          <icon name="mynaui:chevron-right" :size="24" />
        </HoverLink>
      </div>
      <div :class="cardGroupStyles">
        <RecipeCard
          v-for="recipe in recipes!.latestRecipes"
          :key="recipe.slug"
          :title="recipe.title"
          :to="`/recipes/${recipe.slug}`"
          :image="recipe.coverImage"
          :tag="recipe.featuredTag"
          :duration="recipe.totalDurationLabel"
        />
      </div>
    </section>

    <section v-if="recipes!.favouriteRecipes.length > 0">
      <div :class="sectionStyles">
        <h2>Personal Favourites</h2>
      </div>
      <div :class="cardGroupStyles">
        <RecipeCard
          v-for="recipe in recipes!.favouriteRecipes"
          :key="recipe.slug"
          :title="recipe.title"
          :image="recipe.coverImage"
          :to="`/recipes/${recipe.slug}`"
          :tag="recipe.featuredTag"
          :duration="recipe.totalDurationLabel"
          lazy-load-image
        />
      </div>
    </section>

    <section v-if="recipes!.quickRecipes.length > 0">
      <div :class="sectionStyles">
        <h2>Quick Eats</h2>
      </div>

      <div :class="cardGroupStyles">
        <RecipeCard
          v-for="recipe in recipes!.quickRecipes"
          :key="recipe.slug"
          :title="recipe.title"
          :image="recipe.coverImage"
          :to="`/recipes/${recipe.slug}`"
          :tag="recipe.featuredTag"
          :duration="recipe.totalDurationLabel"
          lazy-load-image
        />
      </div>
    </section>

    <section v-if="recipes!.worldCuisineRecipes.length > 0">
      <div :class="sectionStyles">
        <h2>World Cuisines</h2>
      </div>
      <div :class="cardGroupStyles">
        <RecipeCard
          v-for="recipe in recipes!.worldCuisineRecipes"
          :key="recipe.slug"
          :title="recipe.title"
          :image="recipe.coverImage"
          :to="`/recipes/${recipe.slug}`"
          :tag="recipe.featuredTag"
          :duration="recipe.totalDurationLabel"
          lazy-load-image
        />
      </div>
    </section>
  </div>
</template>
