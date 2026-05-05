<script setup lang="ts">
import { css } from "styled-system/css";

interface Props {
  label: string;
  value: string;
}

defineProps<Props>();
</script>

<template>
  <div
    :class="
      css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
      })
    "
  >
    <Text>{{ label }}</Text>
    <Text size="lg" weight="bold">{{ value }}</Text>
  </div>
</template>
