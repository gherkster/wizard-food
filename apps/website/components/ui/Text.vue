<script setup lang="ts">
import { cva } from "styled-system/css";
import type { FontSizeToken, FontWeightToken } from "styled-system/tokens";

interface Props {
  size?: FontSizeToken;
  textWrap?: "wrap" | "noWrap";
  weight?: FontWeightToken;
}

defineProps<Props>();

const textRecipe = cva({
  variants: {
    size: {
      xs: { fontSize: "xs" },
      sm: { fontSize: "sm" },
      md: { fontSize: "md" },
      lg: { fontSize: "lg" },
      xl: { fontSize: "xl" },
      xxl: { fontSize: "xxl" },
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
  <span :class="textRecipe({ size, weight, textWrap })">
    <slot />
  </span>
</template>
