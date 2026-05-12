<script setup lang="ts">
import type { Image } from "@wizard/content";
import { css, cva, cx } from "styled-system/css";
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
    backgroundColor: token("colors.surface"),
    border: "1px solid",
    borderColor: token("colors.border"),
    borderRadius: "sm",
    display: "flex",
    height: "auto",
    width: "100%",

    _hover: {
      borderColor: token("colors.primary"),
    },
  },
  variants: {
    orientation: {
      vertical: {
        alignItems: "flex-start",
        flexDirection: "column",
        height: "100%",

        "& .image-container": {
          width: "100%",
          height: "auto",
        },
      },
      horizontal: {
        alignItems: "stretch",
        flexDirection: "row",

        "& .image-container": {
          height: "100%",
          width: "auto",
          flexShrink: 0,
          flexGrow: 0,
        },

        "& > *:not(.image-container)": {
          flex: 1,
          minWidth: 0,
        },
      },
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

const horizontalImageCss = css({
  borderLeftRadius: "sm",
});

const verticalImageCss = css({
  borderTopRadius: "sm",
});
</script>

<template>
  <NuxtLink
    :to="to"
    :class="
      css({
        borderRadius: 'sm',
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
      <Image
        v-if="image"
        :class="cx(orientation === 'horizontal' ? horizontalImageCss : verticalImageCss)"
        :image="image"
        :lazy="lazyLoadImage"
      />
      <slot />
    </div>
  </NuxtLink>
</template>
