<script setup lang="ts">
import { PopoverArrow, PopoverContent, PopoverRoot, PopoverTrigger } from "reka-ui";
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

interface Props {
  iconPosition?: "left" | "right";
}

withDefaults(defineProps<Props>(), {
  iconPosition: "right",
});

const triggerCss = css({
  cursor: "pointer",
  '&[data-state="open"] .icon': {
    transform: "rotate(180deg)",
  },
});

const iconCss = css({
  transition: "transform 0.15s ease-in-out",
});

const contentCss = css({
  backgroundColor: token("colors.surface"),
  borderColor: token("colors.border"),
  borderRadius: "sm",
  borderWidth: "2px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  padding: "sm",
  zIndex: 1000,
});
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger :class="triggerCss">
      <div
        :class="
          css({
            display: 'flex',
            alignItems: 'end',
            gap: 'xxs',
          })
        "
      >
        <Icon
          v-if="iconPosition === 'left'"
          name="mynaui:chevron-down"
          :class="iconCss"
          :size="24"
        />
        <slot name="trigger" />
        <Icon
          v-if="iconPosition === 'right'"
          name="mynaui:chevron-down"
          :class="iconCss"
          :size="24"
        />
      </div>
    </PopoverTrigger>
    <PopoverContent :class="contentCss" align="start">
      <slot />
      <PopoverArrow :class="css({ fill: token('colors.border') })" />
    </PopoverContent>
  </PopoverRoot>
</template>
