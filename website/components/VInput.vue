<template>
  <div class="input-container">
    <slot name="prepend" :on-click="focusButton" />
    <label>
      {{ label }}
      <input ref="btnRef" v-model="model" type="input" :placeholder="placeholder" size="1" />
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

// Trigger input field focus if the icon is clicked
const btnRef = ref<HTMLInputElement>();
const focusButton = () => btnRef.value?.focus();
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;

.input-container {
  display: flex;
  align-items: center;
  min-width: 160px;
  background-color: var(--theme-input-background-color);
  border-radius: v.$border-radius-md;

  @include m.spacing("px", "xs");

  label,
  input {
    width: 100%;
  }

  input {
    outline: none;
    background-color: var(--theme-input-background-color);
    border: none;
    padding: 12px 8px;
  }
}
</style>
