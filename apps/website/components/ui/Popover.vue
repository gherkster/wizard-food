<script setup lang="ts">
import { Popover as HPopover, PopoverButton, PopoverPanel } from "@headlessui/vue";
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
  outline: "none",
  "&[data-open] .icon": {
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
  boxShadow: token("shadows.subtle"),
  left: "-16px",
  padding: "sm",
  position: "absolute",
  zIndex: 1000,
  outline: "none",
});

const fadeSlideTransition = {
  enterActiveClass: css({
    transition: "opacity,transform 0.1s cubic-bezier(0.2, 0.8, 0.4, 1)",
  }),
  enterFromClass: css({
    opacity: 0,
    transform: "translateY(-10px)",
  }),
  enterToClass: css({
    opacity: 1,
    transform: "translateY(0)",
  }),
  leaveActiveClass: css({
    transition: "all 0.10s ease-in",
  }),
  leaveToClass: css({
    opacity: 0,
    transform: "translateY(-4px)",
  }),
};
</script>

<template>
  <HPopover :class="css({ position: 'relative' })">
    <PopoverButton :class="triggerCss">
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
          :class="[iconCss, 'icon']"
          :size="24"
        />
        <slot name="trigger" />
        <Icon
          v-if="iconPosition === 'right'"
          name="mynaui:chevron-down"
          :class="[iconCss, 'icon']"
          :size="24"
        />
      </div>
    </PopoverButton>

    <Transition v-bind="fadeSlideTransition">
      <PopoverPanel :class="contentCss">
        <slot />
      </PopoverPanel>
    </Transition>
  </HPopover>
</template>
