<template>
  <MascotSVG :class="{ excited: excited }" :width="iconSize" :height="iconSize" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import MascotSVG from "@/components/MascotSVG.vue";

const props = withDefaults(
  defineProps<{
    excited?: boolean;
    size?: number;
  }>(),
  {
    excited: false,
    size: 24,
  },
);

const iconSize = computed(() => `${props.size}px`);
</script>
