<template>
  <n-input :type="type" :value="value" :name="path" :autosize="autosize" placeholder="" @input="input" @focus="focus" @blur="blur" />
</template>

<script>
import { NInput } from "naive-ui";

export default {
  name: "XInput",
  inheritAttrs: false,
  components: { NInput },
  props: {
    value: {
      type: [String, Number],
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
    autosize: {
      required: false,
      default: null,
    },
  },
  methods: {
    input(value) {
      this.$emit("input", { path: this.path, value: value });
    },
    focus() {
      this.$emit("focus", { path: this.path, value: this.value });
    },
    blur() {
      this.$emit("blur", { path: this.path, value: this.value });
    },
  },
};
</script>
