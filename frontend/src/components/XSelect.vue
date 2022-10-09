<template>
  <n-select
    :value="value"
    :options="options"
    :filterable="filterable"
    :tag="tag"
    :multiple="multiple"
    @update:value="handleUpdate"
    @blur="handleBlur"
  />
</template>

<script>
import { NSelect } from "naive-ui";

export default {
  name: "XSelect",
  inheritAttrs: false,
  components: { NSelect },
  props: {
    value: {
      type: [String, Array],
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    filterable: {
      type: Boolean,
      required: false,
      default: false,
    },
    tag: {
      type: Boolean,
      required: false,
      default: false,
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    handleUpdate(value) {
      this.$emit("input", { path: this.path, value: value });
    },
    handleBlur() {
      this.$emit("blur", { path: this.path, value: this.value });
    },
  },
};
</script>

<style scoped>

</style>