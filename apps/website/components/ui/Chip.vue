<script setup lang="ts">
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

interface Props {
  label: string;
}

defineProps<Props>();

const emit = defineEmits<{
  delete: [];
}>();

const chipStack = css({
  alignItems: "center",
  bg: token("colors.surface"),
  border: "1px solid",
  borderColor: token("colors.border"),
  borderRadius: "sm",
  display: "inline-flex",
  fontSize: "sm",
  fontWeight: "medium",
  gap: "4px",
  px: "xs",
  py: "xxs",
  transition: "all",
  userSelect: "none",
});

const closeButton = css({
  alignItems: "center",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  padding: "4px",
});
</script>

<template>
  <div :class="chipStack">
    <Text>{{ label }}</Text>

    <Button :class="closeButton" aria-label="Remove filter" @click="emit('delete')">
      <Icon name="mynaui:x" size="18" />
    </Button>
  </div>
</template>
