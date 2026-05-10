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
        alignItems: 'center',
        backgroundColor: token('colors.surface'),
        border: '2px solid',
        borderColor: token('colors.border'),
        borderRadius: 'md',
        display: 'flex',
        minWidth: '160px',

        '& input': {
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
