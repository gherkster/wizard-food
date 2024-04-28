<template>
  <div>
    <label>
      {{ label }}
      <input v-model="model" :placeholder="placeholder" size="1" />
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value?: string;
  label?: string;
  placeholder?: string;
}>();

const model = defineModel<string>();
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as v;
input {
  min-width: 120px;
  outline: none;
  background-color: transparent;
  border: none;
  border-bottom: solid 2px v.$colour-primary;
  font-size: 20px;
}
</style>
