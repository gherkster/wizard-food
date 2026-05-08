<script setup lang="ts">
import { css } from "styled-system/css";
import type { ButtonHTMLAttributes } from "vue";

interface Props {
  disabled?: boolean;
  type?: ButtonHTMLAttributes["type"];
}

const props = withDefaults(defineProps<Props>(), {
  type: "button",
});

const emit = defineEmits<{
  click: [];
}>();

const onClick = () => {
  if (!props.disabled) {
    emit("click");
  }
};
</script>

<template>
  <button
    :class="
      css({
        backgroundColor: 'transparent',
        borderRadius: 'sm',
        borderStyle: 'none',
        fontSize: '1rem',
        lineHeight: 0,
        padding: 0,
        width: 'fit-content',
        _active: {
          '&:not(:disabled)': {
            transform: 'scale(0.97) translateY(1px)',
            filter: 'brightness(80%)', // Darker than hover to simulate depth
          },
        },
        _disabled: {
          opacity: '0.6',
          cursor: 'not-allowed',
          filter: 'none',
          transform: 'none',
        },
        _hover: {
          '&:not(:disabled)': {
            cursor: 'pointer',
            filter: 'brightness(90%)',
          },
        },
      })
    "
    :disabled="disabled"
    :type="type"
    @click="onClick"
  >
    <slot />
  </button>
</template>
