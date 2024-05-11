<template>
  <form class="search" @submit.prevent="$emit('search', query)">
    <v-input
      v-model="query"
      class="text-muted"
      icon-left="gravity-ui:magnifier"
      placeholder="Search.."
      @update:model-value="$emit('input', query)"
    >
      <template #prepend="{ onClick }">
        <v-icon :icon="magnifier" :size="16" @click="onClick" />
      </template>
    </v-input>
  </form>
</template>

<script setup lang="ts">
import magnifier from "~icons/gravity-ui/magnifier";

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
@use "@/styles/mixins" as m;
@include m.breakpoint("sm", "max") {
  .search {
    flex-basis: 100%;
  }
}
</style>
