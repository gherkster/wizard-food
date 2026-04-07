<script setup lang="ts">
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

defineEmits(["click"]);
</script>

<template>
  <MascotSVG :class="{ excited: excited }" :width="size" :height="size" @click="onClick" />
</template>
