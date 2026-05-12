<script setup lang="ts">
import type { RecipePreview, RecipePromo } from "@wizard/content";
import { css } from "styled-system/css";
import { grid } from "styled-system/patterns";

interface Props {
  promo: RecipePromo;
  sideRecipes: RecipePreview[];
}

defineProps<Props>();

const splitPromoGroupCss = grid({
  alignItems: "stretch",
  columns: {
    base: 1,
    lg: 5,
  },
  gap: "sm",
  marginTop: "sm",
});

const splitCardsContainerCss = css({
  display: "flex",
  flexDirection: "column",
  gridColumn: { base: "1", lg: "span 3" },
  gap: "sm",
  justifyContent: "space-between",
  height: "100%",
});

const promoRecipeCss = css({
  flex: "1",
  display: "flex",
  gridColumn: { base: "1", lg: "span 2" },
  width: "100%",
});

const sideRecipeCss = css({
  display: "flex",
  width: "100%",
  flex: 1,

  "& .image-container": {
    // Reserve enough height for two lines of title text
    minHeight: "130px",

    // Constrain the max width of the image, so that with the defined aspect ratio the height of each card can be calculated
    // Pick a width the works on all screen sizes with the card content
    maxWidth: "40%",
  },

  smDown: {
    "& .card-description": {
      // Hide the description on mobile for the horizontal cards since there's not enough room
      display: "none",
    },
  },
});
</script>

<template>
  <div :class="splitPromoGroupCss">
    <RecipeCard
      :class="promoRecipeCss"
      :description="promo.description"
      :duration="promo.durationTotal?.text"
      :image="promo.coverImage"
      :key="promo.slug"
      :tag="promo.featuredTag"
      :title="promo.title"
      :to="`/recipes/${promo.slug}`"
      orientation="vertical"
    />

    <div :class="splitCardsContainerCss">
      <RecipeCard
        v-for="recipe in sideRecipes"
        :class="sideRecipeCss"
        :description="recipe.descriptionSnippet"
        :duration="recipe.durationTotal?.text"
        :image="recipe.previewImage"
        :key="recipe.slug"
        :tag="recipe.featuredTag"
        :title="recipe.title"
        :to="`/recipes/${recipe.slug}`"
        orientation="horizontal"
      />
    </div>
  </div>
</template>
