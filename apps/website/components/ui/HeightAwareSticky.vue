<script setup lang="ts">
import { css } from "styled-system/css";
import { ref, onMounted, onUnmounted } from "vue";

/**
 * Implements a height aware sticky wrapper component.
 *
 * This component prevents the issue of just using position: sticky with top: 0,
 * where if the child container is taller than the viewport, it will cut off part of it until the sticky container is fully scrolled.
 *
 * This is avoided by checking the height of the content, and only applying sticky if the content will fit in the viewport.
 */

interface Props {
  /** The distance in pixels that the sticky component should be from the edge of the sticky track. */
  offset?: number;
}

const props = withDefaults(defineProps<Props>(), {
  offset: 32,
});

const stickyRef = ref<HTMLElement | null>(null);
const isSticky = ref(false);

const checkFit = () => {
  if (!stickyRef.value) {
    return;
  }

  const viewportHeight = window.innerHeight;
  const contentHeight = stickyRef.value.scrollHeight;
  // Only stick if the list is shorter than the screen
  isSticky.value = contentHeight + props.offset * 2 < viewportHeight;
};

let observer: ResizeObserver | null = null;

onMounted(() => {
  if (!import.meta.client) {
    return;
  }

  checkFit();
  window.addEventListener("resize", checkFit);

  if (stickyRef.value) {
    observer = new ResizeObserver(checkFit);
    observer.observe(stickyRef.value);
  }
});

onUnmounted(() => {
  if (!import.meta.client) {
    return;
  }

  window.removeEventListener("resize", checkFit);
  observer?.disconnect();
});

// Column wrapper ensures the sticky element has a "track" to slide in
const columnWrapper = css({
  height: "full",
  position: "relative",
});
</script>

<template>
  <div :class="columnWrapper">
    <div
      ref="stickyRef"
      :style="{
        top: `${props.offset}px`,
        position: isSticky ? 'sticky' : undefined,
        transition: 'top 0.2s linear',
      }"
    >
      <slot />
    </div>
  </div>
</template>
