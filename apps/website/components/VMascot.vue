<script setup lang="ts">
import { css } from "styled-system/css";

import { debounce } from "~/utils/debounce";

const props = withDefaults(
  defineProps<{
    animate?: boolean;
    size?: number;
  }>(),
  {
    animate: false,
    size: 24,
  },
);

const isAnimated = ref(false);

const animateMascot = () => {
  isAnimated.value = true;
  // Finish animation after a debounced delay
  finishAnimating();
};

const animationDebounceMs = 1000;

const finishAnimating = debounce(() => {
  isAnimated.value = false;
}, animationDebounceMs);

defineEmits(["click"]);
</script>

<template>
  <button
    :class="
      css({
        lineHeight: 0,
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
      })
    "
    @click="animateMascot"
  >
    <MascotSVG :class="{ excited: animate || isAnimated }" :width="size" />
  </button>
</template>
