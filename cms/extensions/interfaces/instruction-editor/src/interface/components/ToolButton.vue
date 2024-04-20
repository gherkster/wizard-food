<template>
  <v-button
    v-tooltip="tooltip"
    tabindex="-1"
    :aria-label="title"
    :disabled="disabled"
    :aria-disabled="disabled"
    :aria-pressed="active"
    :class="{ 'is-active': active }"
    :icon="small"
    :small="small"
    :x-small="!small"
    @click="action"
  >
    <template v-if="icon === false">{{ display ? display : title }}</template>
    <v-icon v-if="icon !== false" :name="icon" />
  </v-button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ToolButtonProps } from "../tiptap/types";

const props = withDefaults(defineProps<ToolButtonProps>(), {
  icon: false,
  display: false,
  shortcut: () => [],
  active: false,
  disabled: false,
});

const tooltip = computed(() => {
  if (!props.shortcut.length) return props.title;

  return `${props.title} ${props.shortcut}`;
});

const small = computed(() => props.icon || props.display);
</script>

<style scoped>
.is-active :deep(.button:not(:disabled)) {
  color: var(--v-button-color-active);
  background-color: var(--v-button-background-color-active);
}
</style>
../../common/types/types