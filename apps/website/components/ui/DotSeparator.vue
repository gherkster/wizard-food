<script setup lang="ts">
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";
</script>

<template>
  <span
    :class="
      css({
        display: 'inline-block',
        width: '0.25rem',
        height: '0.25rem',
        backgroundColor: token('colors.border'),
        borderRadius: '100%',
        margin: 'auto 0',
      })
    "
  />
</template>
