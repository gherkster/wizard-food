<script setup lang="ts">
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

defineProps<{
  iconName?: string;
}>();

const tagSize = "12px";
</script>

<template>
  <div
    :class="
      css({
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'content-box',
        border: `2px solid ${token('colors.primary')}`,
        columnGap: token('spacing.xxs'),
        height: tagSize,
        lineHeight: tagSize,
        borderRadius: token('radii.md'),
        textAlign: 'center',
        fontSize: '1rem',
        padding: '8px',
      })
    "
  >
    <icon v-if="iconName" :name="iconName" :size="16" />
    <slot />
  </div>
</template>
