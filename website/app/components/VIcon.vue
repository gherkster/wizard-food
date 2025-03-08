<template>
  <component :is="icon" :style="styles" />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    icon: Component;
    package?: string;
    size?: number;
  }>(),
  {
    package: "custom",
    size: 24,
  },
);

const styles = computed(() => {
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
  };
});
</script>
