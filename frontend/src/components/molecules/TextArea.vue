<template>
  <div class="component responsive">
    <span class="form-input-label">{{ label }}</span>
    <div :class="formInputClass" @click.self="$refs.inputField.focus()">
      <textarea
        ref="inputField"
        :value="value"
        :name="path"
        :rows="rows"
        class="form-input-field"
        @input="input"
        @focus="focus"
        @blur="blur"
      />
    </div>
    <div class="form-validation-message">
      <validation-message>{{ errors[0] }}</validation-message>
    </div>
  </div>
</template>

<script>
import ValidationMessage from "@/components/atoms/ValidationMessage";

export default {
  name: "TextArea",
  components: { ValidationMessage },
  props: {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    rows: {
      type: Number,
      required: false,
      default: 6,
    },
    errors: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data: () => ({
    isActive: false,
  }),
  computed: {
    formInputClass: function () {
      return this.error ? "form-input__error" : "form-input";
    },
  },
  methods: {
    input(event) {
      this.$emit("input", { path: this.path, value: event.target.value });
    },
    focus(event) {
      this.isActive = true;
      this.$emit("focus", { path: this.path, value: event.target.value });
    },
    blur(event) {
      this.isActive = false;
      this.$emit("blur", { path: this.path, value: event.target.value });
    },
  },
};
</script>
