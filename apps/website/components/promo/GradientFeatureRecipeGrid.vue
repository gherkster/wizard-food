<script setup lang="ts">
import { imageAspectRatio, type RecipePreview, type RecipePromo } from "@wizard/content";
import { css } from "styled-system/css";
import { grid } from "styled-system/patterns";

interface Props {
  promo: RecipePromo;
  sideRecipes: RecipePreview[];
}

defineProps<Props>();

const megaPromoGroupCss = grid({
  alignItems: "stretch",
  columns: {
    base: 1,
    lg: 5,
  },
  gap: "sm",
  marginTop: "sm",
});

const megaPromoImageCss = css({
  aspectRatio: `${imageAspectRatio.x}/${imageAspectRatio.y}`, // Force a square aspect ratio so we know the height
  gridColumn: { base: "1", lg: "span 3" },
  objectFit: "cover",
  width: "100%",
});

const megaPromoContentCss = css({
  display: "flex",
  flexDirection: "column",
  padding: "sm",
});

const megaSideCardsContainerCss = css({
  display: "flex",
  flexDirection: "column",
  gridColumn: { base: "1", lg: "span 2" },
  gap: "sm",
  justifyContent: "space-between",
  height: "100%",
});

const cardFlexItemCss = css({
  display: "flex",

  "& .image-container": {
    // Reserve enough height for two lines of title text
    minHeight: "120px",
    // Constrain the max width of the image, so that with the defined aspect ratio the height of each card can be calculated
    // Pick a width the works on all screen sizes with the card content
    maxWidth: "40%",

    lg: {
      // Use a taller card on larger screen sizes to fill the space
      minHeight: "150px",
    },
  },
});
</script>

<template>
  <div :class="megaPromoGroupCss">
    <PromoImage
      :class="megaPromoImageCss"
      :image="promo.coverImage"
      :title="promo.title"
      :to="`/recipes/${promo.slug}`"
    >
      <div :class="megaPromoContentCss">
        <Text weight="bold">{{ promo.featuredTag }}</Text>
        <Text is="h2" size="xxl" weight="bold">{{ promo.title }}</Text>
        <Text>{{ promo.description }}</Text>
      </div>
    </PromoImage>

    <div :class="megaSideCardsContainerCss">
      <RecipeCard
        v-for="recipe in sideRecipes"
        :class="cardFlexItemCss"
        :key="recipe.slug"
        :title="recipe.title"
        :to="`/recipes/${recipe.slug}`"
        :image="recipe.previewImage"
        :tag="recipe.featuredTag"
        :duration="recipe.durationTotal?.text"
        orientation="horizontal"
      />
    </div>
  </div>
</template>
