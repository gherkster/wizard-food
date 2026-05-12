<script setup lang="ts">
import type { Image } from "@wizard/content";
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

import type { RouteLocationRaw } from "#vue-router";

defineProps<{
  to: RouteLocationRaw;
  image: Image;
}>();

const linkCss = css({
  border: "1px solid",
  borderColor: token("colors.border"),
  borderRadius: "sm",
  color: token("colors.bone"),
  display: "block",
  height: "fit-content",
  overflow: "hidden",
  position: "relative",
  width: "100%",

  _canHover: {
    _hover: {
      borderColor: token("colors.primary"),
      color: token("colors.rockmelon"),
    },
  },
});
</script>

<template>
  <NuxtLink :to="to" :class="linkCss">
    <Image :image="image" fetch-priority="high" />

    <div
      :class="
        css({
          alignItems: 'end',
          display: 'flex',
          position: 'absolute',
          inset: 0,
          // Gradient from bottom (dark) to top (transparent)
          background:
            'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 60%, transparent 100%)',
        })
      "
    >
      <div>
        <slot />
      </div>
    </div>
  </NuxtLink>
</template>
