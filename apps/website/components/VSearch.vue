<script setup lang="ts">
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

const props = defineProps<{
  value: string;
}>();

const query = ref(props.value);

watch(
  () => props.value,
  (newValue) => (query.value = newValue),
);

defineEmits<{
  input: [value: string];
  search: [value: string];
}>();
</script>

<template>
  <form
    :class="
      css({
        flexBasis: {
          base: undefined,
          smDown: '100%',
        },
      })
    "
    role="search"
    @submit.prevent="$emit('search', query)"
  >
    <Input
      v-model="query"
      :class="css({ color: token('colors.font.muted') })"
      icon-left="mynaui:search"
      placeholder="Search recipes..."
      @update:model-value="$emit('input', query)"
    />
  </form>
</template>
