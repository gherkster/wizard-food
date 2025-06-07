<template>
  <v-button
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
    <v-icon v-if="icon" :name="icon" />
    <template v-else>{{ display ? display : title }}</template>
  </v-button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Tool } from "../../common/types/tools";

const props = defineProps<{
  title: string;
  icon?: string;
  display?: string;
  action: Tool["action"];
  shortcut?: Tool["shortcut"];
  active?: boolean;
  disabled?: boolean;
}>();

const small = computed(() => props.icon || props.display);
</script>

<style scoped>
.is-active :deep(.button:not(:disabled)) {
  color: var(--v-button-color-active);
  background-color: var(--v-button-background-color-active);
}
</style>
