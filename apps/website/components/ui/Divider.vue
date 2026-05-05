<script setup lang="ts">
import { Separator, type SeparatorProps } from "reka-ui";
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

interface Props extends SeparatorProps {}

defineProps<Props>();
</script>

<template>
  <Separator
    v-bind="$props"
    :class="
      css({
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: token('colors.border'),
      })
    "
  />
</template>
