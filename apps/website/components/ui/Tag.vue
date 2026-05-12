<script setup lang="ts">
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

defineProps<{
  iconName?: string;
}>();

const tagSize = "12px";

const tagCss = css({
  alignItems: "center",
  border: `2px solid ${token("colors.primary")}`,
  borderRadius: "md",
  boxSizing: "content-box",
  columnGap: "xxs",
  display: "flex",
  fontSize: "md",
  height: tagSize,
  lineHeight: tagSize,
  padding: "6px",
  textAlign: "center",
});
</script>

<template>
  <div :class="tagCss">
    <icon v-if="iconName" :name="iconName" :size="14" />
    <slot />
  </div>
</template>
