<template>
  <div class="v-switch">
    <v-button
      v-for="(option, index) in options"
      :key="option"
      :active="option === modelValue"
      @click="onClick(index)"
      >{{ option }}</v-button
    >
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  options: string[];
  modelValue: string;
}>();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (e: "update:modelValue", value: string): void;
}>();

function onClick(index: number) {
  emit("update:modelValue", props.options[index]);
}
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as v;
.v-switch {
  > *:first-child {
    border-top-left-radius: v.$border-radius-md;
    border-bottom-left-radius: v.$border-radius-md;
  }
  > *:last-child {
    border-top-right-radius: v.$border-radius-md;
    border-bottom-right-radius: v.$border-radius-md;
  }
}
</style>
