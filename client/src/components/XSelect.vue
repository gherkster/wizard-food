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
      :ignore-composition="false"
      show-on-focus
      @focus="handleFocus"
      @update:value="handleUpdate"
      @blur="handleBlur"
      @create="onSearch"
    />
  </n-form-item>
</template>

<script setup lang="ts">
import { NFormItem, NSelect } from "naive-ui";
import { ValueLabelPair } from "@/types/form";
import { computed, ref } from "vue";
import { ErrorObject } from "@vuelidate/core";

const props = withDefaults(
  defineProps<{
    value: string | Array<string>;
    label: string;
    options: Array<ValueLabelPair>;
    errors?: Array<ErrorObject>;
    filterable?: boolean;
    tag?: boolean;
    multiple?: boolean;
    clearable?: boolean;
    required?: boolean;
    showLabel?: boolean;
    showError?: boolean;
  }>(),
  {
    showLabel: true,
    showError: true,
  }
);

const currentSearchTerm = ref("");

const validationMessage = computed(() => {
  return props.errors && props.errors.length > 0 ? props.errors[0].$message : null;
});

const validationStatus = computed(() => {
  return props.errors && props.errors.length > 0 ? "error" : "";
});

/**
 * Set currentSearchTerm to the current text a user is entering before confirming a new tag
 *
 * This allows us to create a new tag with the currentSearchTerm value if the user clicks off the tag box,
 * which is the expected behaviour of this input field.
 *
 * It also resolves mobile browsers not creating the tag and skipping the input
 * when the "enter" button is clicked (renders as a next button)
 * @param searchTerm
 * @returns {{label, value}}
 */
function onSearch(searchTerm: string) {
  currentSearchTerm.value = searchTerm;
  return {
    label: searchTerm,
    value: searchTerm,
  };
}

const emit = defineEmits<{
  (e: "focus"): void;
  (e: "input", value: string | Array<string>): void;
  (e: "blur", value: string | Array<string>): void;
}>();

function handleFocus() {
  emit("focus");
}
function handleUpdate(value: string | Array<string>) {
  emit("input", value);
}

function handleBlur() {
  let emittedValue = props.value;
  if (currentSearchTerm.value) {
    if (props.multiple) {
      // Mimic the native functionality by adding a new tag if it doesn't exist already
      if (!props.value.includes(currentSearchTerm.value) && Array.isArray(emittedValue)) {
        // If a multiple tag based select dropdown box create a new tag from the pending search term for better usability
        emittedValue.push(currentSearchTerm.value);
      }
    } else {
      // If a normal select dropdown box set the value of the field to the pending search term for better usability
      emittedValue = currentSearchTerm.value;
    }
    currentSearchTerm.value = "";
  }
  emit("blur", emittedValue);
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
