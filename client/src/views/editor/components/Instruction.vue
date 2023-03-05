<template>
  <x-row class="list-item instruction">
    <x-column col-12 col-md-11>
      <x-input
        ref="name"
        path="label"
        label="Instruction"
        type="textarea"
        :prefix="prefix"
        :autosize="{ minRows: 1, maxRows: 6 }"
        :value="label"
        :show-label="showLabels"
        @input="handleInput"
        @blur="handleBlur"
      />
    </x-column>
    <slot name="end" />
  </x-row>
</template>

<script>
import { XInput, XRow, XColumn } from "@/components";

export default {
  name: "Instruction",
  inheritAttrs: false,
  components: {
    XInput,
    XRow,
    XColumn,
  },
  props: {
    prefix: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    showLabels: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  methods: {
    handleInput(event) {
      this.$emit("input", event);
    },
    handleBlur(event) {
      this.$emit("blur", event);
    },
  },
};
</script>

<style scoped lang="scss">
.instruction {
  margin: unset;
}
</style>
