<template>
  <n-form-item
    :label="label"
    :show-label="showLabel"
    :show-feedback="showError"
    :required="required"
    :feedback="validationMessage"
    :validation-status="validationStatus"
  >
    <n-input-group>
      <n-input-group-label v-if="prefix">{{ prefix }}</n-input-group-label>
      <n-input
        ref="input"
        :type="type"
        :value="value"
        :name="path"
        :autosize="autosize"
        placeholder=""
        @input="input"
        @focus="focus"
        @blur="blur"
      />
      <n-input-group-label v-if="suffix">{{ suffix }}</n-input-group-label>
      <slot name="suffix" />
    </n-input-group>
  </n-form-item>
</template>

<script>
import { NFormItem, NInput, NInputGroup, NInputGroupLabel } from "naive-ui";

export default {
  name: "XInput",
  inheritAttrs: false,
  components: { NFormItem, NInput, NInputGroup, NInputGroupLabel },
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: "text",
    },
    path: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    errors: {
      type: Array,
      required: false,
      default: () => [],
    },
    autosize: {
      required: false,
      default: null,
    },
    prefix: {
      type: String,
      required: false,
      default: "",
    },
    suffix: {
      type: String,
      required: false,
      default: "",
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
    input(value) {
      this.$emit("input", {
        path: this.path,
        value: value,
      });
    },
    focus() {
      this.$emit("focus", {
        path: this.path,
        value: this.value,
      });
    },
    blur() {
      this.$emit("blur", {
        path: this.path,
        value: this.value,
      });
    },
    selectSelf() {
      this.$refs.input.select();
    },
  },
};
</script>
