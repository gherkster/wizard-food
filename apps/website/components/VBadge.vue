<script setup lang="ts">
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

const badgeSize = "20px";
</script>

<template>
  <div
    :class="
      css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: badgeSize,
        height: badgeSize,
        lineHeight: badgeSize,
        boxSizing: 'content-box',
        borderRadius: '50%',
        textAlign: 'center',
        fontSize: '0.9rem',
        fontWeight: token('fontWeights.bold'),
        border: `2px solid ${token('colors.primary')}`,
        padding: '4px',
      })
    "
  >
    <slot />
  </div>
</template>
