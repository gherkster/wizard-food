<template>
  <x-row class="list-item instruction">
    <x-column col-11>
      <x-input
        ref="label"
        path="label"
        label="Instruction"
        type="textarea"
        :prefix="prefix"
        required
        :autosize="{ minRows: 1, maxRows: 6 }"
        :value="label"
        :errors="v$.label.$errors"
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
import { NFormItem } from "naive-ui";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default {
  name: "Instruction",
  inheritAttrs: false,
  components: {
    XInput,
    XRow,
    XColumn,
    NFormItem,
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
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  validations() {
    return {
      label: {
        required,
      },
    };
  },
  methods: {
    handleInput(event) {
      this.$emit("input", event);
      if (this.v$[event.path]) {
        this.v$[event.path].$touch();
      }
    },
    handleBlur(event) {
      this.$emit("blur", event);
      if (this.v$[event.path]) {
        this.v$[event.path].$touch();
      }
    },
  },
};
</script>
