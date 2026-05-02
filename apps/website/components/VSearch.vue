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
    <VInput
      v-model="query"
      :class="css({ color: token('colors.font.muted') })"
      icon-left="mynaui:search"
      placeholder="Search recipes..."
      @update:model-value="$emit('input', query)"
    >
      <template #prepend="{ onClick }">
        <span :class="css({ lineHeight: 0 })" @click="onClick">
          <icon name="mynaui:search" :size="20" />
        </span>
      </template>
    </VInput>
  </form>
</template>
