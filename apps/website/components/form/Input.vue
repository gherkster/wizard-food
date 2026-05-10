<script setup lang="ts">
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

defineProps<{
  clearable?: boolean;
  iconLeft?: string;
  label?: string;
  placeholder?: string;
  value?: string;
}>();

const model = defineModel<string>({
  required: true,
});

const containerCss = css({
  alignItems: "center",
  backgroundColor: token("colors.surface"),
  border: "2px solid",
  borderColor: token("colors.border"),
  borderRadius: "md",
  display: "flex",
  minWidth: "160px",

  "& input": {
    outline: "none",
    padding: "10px 12px",
    width: "100%",
  },
  "& label": {
    width: "100%",
  },
  _focusWithin: {
    borderColor: token("colors.primary"),
  },
});

const clearButtonCss = css({
  color: token("colors.font.muted"),
  marginRight: "4px",
  padding: "4px",
});
</script>

<template>
  <div :class="containerCss">
    <label>
      {{ label }}
      <input v-model="model" type="input" :placeholder="placeholder" size="1" />
    </label>

    <Button v-if="clearable && model" :class="clearButtonCss" @click="model = ''">
      <Icon name="mynaui:x" :size="20" />
    </Button>
  </div>
</template>
