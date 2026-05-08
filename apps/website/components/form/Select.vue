<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  ListboxLabel,
} from "@headlessui/vue";
import { css, cx } from "styled-system/css";
import { token } from "styled-system/tokens";

import type { SelectOption } from "~/types/form";

interface Props {
  label?: string;
  options: SelectOption[];
  placeholder: string;
}

defineProps<Props>();

const selectedValue = defineModel<string | undefined>({
  required: true,
});

const minWidth = "160px";

const triggerCss = css({
  alignItems: "center",
  backgroundColor: token("colors.surface"),
  borderColor: token("colors.border"),
  borderRadius: "sm",
  borderWidth: "1px",
  cursor: "pointer",
  display: "flex",
  minWidth: minWidth,
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

const optionsCss = css({
  backgroundColor: token("colors.surface"),
  borderColor: token("colors.primary"),
  borderRadius: "sm",
  borderWidth: "1px",
  boxShadow: token("shadows.subtle"),
  minWidth: minWidth,
  marginTop: "4px",
  padding: "xxs",
  position: "absolute",
  zIndex: 100,
  outline: "none",
  overflow: "auto",
  maxHeight: "60vh",
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
        <ListboxButton :class="cx(triggerCss)">
          <span
            :class="
              css({ flex: 1, truncate: true, color: !selectedValue ? 'gray.400' : 'inherit' })
            "
          >
            {{ selectedValue || placeholder }}
          </span>
          <icon name="mynaui:chevron-down" />
        </ListboxButton>

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
      </div>
    </div>
  </Listbox>
</template>
