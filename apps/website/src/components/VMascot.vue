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

defineEmits<{
  click: [];
}>();
</script>

<template>
  <span @click="$emit('click')">
    <MascotSVG :class="{ excited: excited }" :width="size" :height="size" />
  </span>
</template>
