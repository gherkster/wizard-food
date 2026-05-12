<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  ListboxLabel,
} from "@headlessui/vue";
import { css, cx } from "styled-system/css";
import { reveal } from "styled-system/recipes";
import { token } from "styled-system/tokens";

import { fadeSlideTransition } from "~/styles/utils";
import type { SelectOption } from "~/types/form";

interface Props {
  block?: boolean;
  label?: string;
  loading?: boolean;
  options: SelectOption[];
  placeholder: string;
}

defineProps<Props>();

const selectedValue = defineModel<string | undefined>({
  required: true,
});

const triggerCss = css({
  alignItems: "center",
  backgroundColor: token("colors.surface"),
  borderColor: token("colors.border"),
  borderRadius: "sm",
  borderWidth: "1px",
  cursor: "pointer",
  display: "flex",
  gap: "8px",
  px: "xs",
  py: "xxs",
  outline: "none",
  textAlign: "left",

  _hover: {
    borderColor: token("colors.primary"),
  },
  _expanded: {
    borderColor: token("colors.primary"),
  },
});

const textBaseCss = css({
  flex: 1,
  truncate: true,
});

const optionsCss = css({
  backgroundColor: token("colors.surface"),
  borderColor: token("colors.primary"),
  borderRadius: "sm",
  borderWidth: "1px",
  boxShadow: token("shadows.subtle"),
  marginTop: "4px",
  padding: "xxs",
  position: "absolute",
  zIndex: 100,
  outline: "none",
  overflow: "auto",
  maxHeight: "60vh",
  width: "100%",
});

const itemCss = css({
  cursor: "default",
  px: "xs",
  py: "4px",
  borderRadius: "xs",
  outline: "none",
  userSelect: "none",

  "&[data-headlessui-state*='active']": {
    backgroundColor: token("colors.selection"),
  },
  _disabled: {
    color: token("colors.font.muted"),
  },
});

const iconCss = css({
  transition: "transform 0.15s ease",

  // Target the icon when the parent button is expanded
  '[data-headlessui-state*="open"] &': {
    transform: "rotate(180deg)",
  },
});
</script>

<template>
  <Listbox
    :model-value="selectedValue ?? ''"
    @update:model-value="(value: string | null) => (selectedValue = value ?? undefined)"
  >
    <div>
      <ListboxLabel v-if="label">
        <Text size="sm">{{ label }}</Text>
      </ListboxLabel>
      <div :class="css({ position: 'relative' })">
        <ListboxButton :class="triggerCss" :style="block ? 'width: 100%' : undefined">
          <Text :class="cx(textBaseCss, reveal({ loading }))" size="md">
            {{ loading ? "&nbsp;" : selectedValue || placeholder }}
          </Text>
          <Icon :class="iconCss" name="mynaui:chevron-down" />
        </ListboxButton>

        <Transition v-bind="fadeSlideTransition">
          <ListboxOptions :class="optionsCss" :style="{ '--anchor-gap': '5px' }">
            <ListboxOption
              v-for="option in options"
              :key="option.value"
              :disabled="option.disabled"
              :value="option.value"
              as="template"
            >
              <div :class="itemCss">
                {{ option.label }}
              </div>
            </ListboxOption>
          </ListboxOptions>
        </Transition>
      </div>
    </div>
  </Listbox>
</template>
