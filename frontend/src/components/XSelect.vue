<template>
  <n-form-item
    :label="label"
    :required="required"
    :show-label="showLabel"
    :show-feedback="showError"
    :feedback="validationMessage"
    :validation-status="validationStatus"
  >
    <n-select
      ref="input"
      :value="value"
      :options="options"
      :filterable="filterable"
      :tag="tag"
      :multiple="multiple"
      placeholder=""
      :clearable="clearable"
      @focus="handleFocus"
      @update:value="handleUpdate"
      @blur="handleBlur"
    />
  </n-form-item>
</template>

<script>
import { NFormItem, NSelect } from "naive-ui";

export default {
  name: "XSelect",
  inheritAttrs: false,
  components: { NFormItem, NSelect },
  props: {
    value: {
      type: [String, Array],
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    errors: {
      type: Array,
      required: false,
      default: () => [],
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
    clearable: {
      type: Boolean,
      required: false,
      default: false,
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    showLabel: {
      type: Boolean,
      required: false,
      default: true,
    },
    showError: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    validationMessage() {
      return this.errors.length > 0 ? this.errors[0].$message : null;
    },
    validationStatus() {
      return this.errors.length > 0 ? "error" : "";
    },
  },
  methods: {
    handleFocus() {
      this.$emit("focus", {
        path: this.path,
        value: this.value,
      });
    },
    handleUpdate(value) {
      this.$emit("input", {
        path: this.path,
        value: value,
      });
    },
    handleBlur() {
      this.$emit("blur", {
        path: this.path,
        value: this.value,
      });
    },
    selectSelf() {
      console.log(this.$refs.input);
      this.$refs.input.handleTriggerClick();
    },
  },
};
</script>
