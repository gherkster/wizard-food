<template>
  <label>
    {{ label }}
    <input :value="value" type="checkbox" />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
}>();
</script>
