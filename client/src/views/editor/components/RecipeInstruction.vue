<template>
  <x-row class="list-item instruction">
    <x-column col-12 col-md-11>
      <x-input
        ref="label"
        path="label"
        label="Instruction"
        type="textarea"
        :prefix="props.prefix"
        :autosize="{ minRows: 1, maxRows: 6 }"
        :value="props.label"
      />
    </x-column>
    <slot name="end" />
  </x-row>
</template>

<script setup lang="ts">
import { XInput, XRow, XColumn } from "@/components";

const props = defineProps<{
  prefix: string;
  label: string;
}>();
</script>

<style scoped lang="scss">
.instruction {
  margin: unset;
}
</style>
