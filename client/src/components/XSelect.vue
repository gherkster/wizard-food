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
  data() {
    return {
      currentSearchTerm: "",
    };
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
    onSearch(searchTerm) {
      this.currentSearchTerm = searchTerm;
      return {
        label: searchTerm,
        value: searchTerm,
      };
    },
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
      let emittedValue = this.value;
      if (this.currentSearchTerm) {
        if (this.multiple) {
          // Mimic the native functionality by adding a new tag if it doesn't exist already
          if (!this.value.includes(this.currentSearchTerm)) {
            // If a multiple tag based select dropdown box create a new tag from the pending search term for better usability
            emittedValue.push(this.currentSearchTerm);
          }
        } else {
          // If a normal select dropdown box set the value of the field to the pending search term for better usability
          emittedValue = this.currentSearchTerm;
        }
        this.currentSearchTerm = "";
      }
      this.$emit("blur", {
        path: this.path,
        value: emittedValue,
      });
    },
    selectSelf() {
      this.$refs.input.handleTriggerClick();
    },
  },
};
</script>
