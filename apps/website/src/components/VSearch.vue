<template>
  <form class="search" role="search" @submit.prevent="$emit('search', query)">
    <v-input
      v-model="query"
      class="text-muted"
      icon-left="mynaui:search"
      placeholder="Search..."
      @update:model-value="$emit('input', query)"
    >
      <template #prepend="{ onClick }">
        <button type="button" class="search__icon" aria-label="Search" @click="onClick">⌕</button>
      </template>
    </v-input>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import VInput from "@/components/VInput.vue";

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

<style lang="scss" scoped>
@use "../styles/mixins" as m;
@include m.breakpoint("sm", "max") {
  .search {
    flex-basis: 100%;
  }
}

.search__icon {
  border: none;
  background: transparent;
  color: var(--theme-font-color-muted);
  cursor: pointer;
}
</style>
