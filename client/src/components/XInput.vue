<template>
  <n-form-item
    :label="label"
    :show-label="showLabel"
    :show-feedback="showError"
    :required="required"
    :feedback="validationMessage"
    :size="size"
    :validation-status="validationStatus"
  >
    <n-input-group>
      <n-input-group-label :size="size" v-if="prefix">{{ prefix }}</n-input-group-label>
      <n-input
        ref="input"
        :type="type"
        :value="value"
        :autosize="autosize"
        :size="size"
        :input-props="inputProps"
        placeholder=""
        @focus="onFocus"
        @input="onInput"
        @blur="onBlur"
        @keyup="$emit('keyup', $event)"
      />
      <n-input-group-label v-if="suffix" :size="size">{{ suffix }}</n-input-group-label>
      <slot name="suffix" />
    </n-input-group>
  </n-form-item>
</template>

<script setup lang="ts">
import { NFormItem, NInput, NInputGroup, NInputGroupLabel } from "naive-ui";
import { ErrorObject } from "@vuelidate/core";
import { Size } from "naive-ui/es/form/src/interface";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    value: string | number;
    label: string;
    type?: string;
    required?: boolean;
    errors?: Array<ErrorObject>;
    autosize?: boolean;
    prefix?: string;
    suffix?: string;
    size?: Size;
    inputMode?: string;
    showLabel?: boolean;
    showError?: boolean;
  }>(),
  {
    type: "text",
    size: "large",
    inputMode: "text",
    showLabel: true,
    showError: true,
  }
);

const validationMessage = computed(() => {
  return props.errors && props.errors.length > 0 ? props.errors[0].$message : null;
});

const validationStatus = computed(() => {
  return props.errors && props.errors.length > 0 ? "error" : "";
});

const inputProps = computed(() => {
  return {
    inputMode: props.inputMode,
  };
});

const emit = defineEmits<{
  (e: "focus"): void;
  (e: "input", value: string | number): void;
  (e: "blur"): void;
}>();
function onInput(value: string | number) {
  emit("input", value);
}
function onFocus() {
  emit("focus");
}
function onBlur() {
  emit("blur");
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>