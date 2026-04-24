<script setup lang="ts">
import { css } from "styled-system/css";

import type { NuxtLinkProps } from "#app";

defineProps<NuxtLinkProps>();
</script>

<template>
  <NuxtLink
    v-bind="$props"
    :class="
      css({
        textDecoration: 'none',
        color: 'font',
        _hover: {
          textDecoration: 'underline',
        },
        _visited: {
          color: 'font',
        },
      })
    "
  >
    <slot />
  </NuxtLink>
</template>
