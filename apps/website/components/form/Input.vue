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
</script>

<template>
  <div
    :class="
      css({
        display: 'flex',
        alignItems: 'center',
        minWidth: '160px',
        '& input': {
          backgroundColor: token('colors.surface'),
          borderRadius: 'md',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: token('colors.border'),
          outline: 'none',
          padding: '10px 12px',
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
    <label>
      {{ label }}
      <input v-model="model" type="input" :placeholder="placeholder" size="1" />
    </label>
  </div>
</template>
