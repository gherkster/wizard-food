<script setup lang="ts">
import { cva } from "styled-system/css";
import type { FontSizeToken, FontWeightToken } from "styled-system/tokens";

interface Props {
  is?: "div" | "span" | "p";
  size?: FontSizeToken;
  textWrap?: "wrap" | "noWrap";
  weight?: FontWeightToken;
}

withDefaults(defineProps<Props>(), {
  is: "span",
});

const textRecipe = cva({
  variants: {
    size: {
      xs: { fontSize: "xs" },
      sm: { fontSize: "sm" },
      md: { fontSize: "md" },
      lg: { fontSize: "lg" },
      xl: { fontSize: "xl" },
      xxl: { fontSize: "xxl" },
      xxxl: { fontSize: "xxxl" },
    },
    weight: {
      bold: { fontWeight: "bold" },
      regular: { fontWeight: "regular" },
    },
    textWrap: {
      wrap: { textWrap: "wrap" },
      noWrap: { textWrap: "nowrap" },
    },
  },
  defaultVariants: {
    size: "md",
    weight: "regular",
  },
});
</script>

<template>
  <component :is="is" :class="textRecipe({ size, weight, textWrap })">
    <slot />
  </component>
</template>
