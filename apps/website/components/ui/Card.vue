<script setup lang="ts">
import type { Image } from "@wizard/content";
import { css, cva } from "styled-system/css";
import { token } from "styled-system/tokens";

import type { RouteLocationRaw } from "#vue-router";

interface Props {
  appearance?: "fill";
  image?: Image;
  lazyLoadImage?: boolean;
  orientation?: "vertical" | "horizontal";
  to?: RouteLocationRaw;
}

defineProps<Props>();

const cardRecipe = cva({
  base: {
    display: "flex",
    height: "100%",
  },
  variants: {
    orientation: {
      vertical: { flexDirection: "column" },
      horizontal: { flexDirection: "row" },
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});
</script>

<template>
  <NuxtLink
    :to="to"
    :class="
      css({
        textDecoration: 'none',
        color: 'font',
        transitionProperty: 'colors',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDuration: '150ms',
        _hover: {
          color: token('colors.link'),
        },
        _visited: {
          color: 'font',
        },
      })
    "
  >
    <div :class="cardRecipe({ orientation })">
      <BlurrableImage
        v-if="image"
        :img="image"
        :lazy="lazyLoadImage"
        purpose="preview"
        shape="square"
      />
      <slot />
    </div>
  </NuxtLink>
</template>
