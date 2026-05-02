<script setup lang="ts">
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

defineProps<{
  value?: string;
  label?: string;
  placeholder?: string;
  iconLeft?: string;
}>();

const model = defineModel<string>({
  required: true,
});

// Trigger input field focus if the icon is clicked
const btnRef = ref<HTMLInputElement>();
const focusButton = () => btnRef.value?.focus();
</script>

<template>
  <div
    :class="
      css({
        display: 'flex',
        alignItems: 'center',
        minWidth: '160px',
        borderRadius: 'md',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: token('colors.border'),
        backgroundColor: token('colors.surface'),
        px: 'xxs',
        '& input': {
          backgroundColor: token('colors.surface'),
          outline: 'none',
          padding: '10px 4px',
          width: '100%',
        },
        '& label': {
          width: '100%',
        },
        _focusWithin: {
          borderColor: token('colors.primary'),
        },
      })
    "
  >
    <slot name="prepend" :on-click="focusButton" />
    <label>
      {{ label }}
      <input ref="btnRef" v-model="model" type="input" :placeholder="placeholder" size="1" />
    </label>
  </div>
</template>
