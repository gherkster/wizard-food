<template>
  <label>
    {{ label }}
    <input :value="value" type="radio" />
  </label>
</template>

<script setup lang="ts">
defineProps<{
  value: string;
  label: string;
}>();
</script>
