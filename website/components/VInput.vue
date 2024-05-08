<template>
  <div class="input-container">
    <icon v-if="iconLeft" :name="iconLeft" size="16" />
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
  iconLeft?: string;
}>();
const model = defineModel<string>();
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;
.input-container {
  display: flex;
  align-items: center;
  background-color: var(--theme-input-background-color);
  @include m.spacing("px", "xs");
  border-radius: v.$border-radius-md;
  input {
    min-width: 160px;
    outline: none;
    background-color: var(--theme-input-background-color);
    border: none;
    padding: 12px 8px;
  }
}
</style>