<script setup lang="ts">
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";
</script>

<template>
  <hr
    :class="
      css({
        borderBottomWidth: '2px',
        borderStyle: 'solid',
        borderColor: token('colors.border'),
      })
    "
  />
</template>
