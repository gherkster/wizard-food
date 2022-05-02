<template>
  <div class="form-container">
    <div class="form-input-container">
      <div :class="formInputClass" @click="$refs.inputField.focus()">
        <input-label :label="label" :is-active="isFieldActive" />
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
    </div>
    <div class="form-validation-message">
      <validation-message>{{ errors[0] }}</validation-message>
    </div>
  </div>
</template>

<script>
import InputLabel from "@/components/atoms/InputLabel";
import ValidationMessage from "@/components/atoms/ValidationMessage";

export default {
  name: "TextArea",
  components: { InputLabel, ValidationMessage },
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
    isFieldActive: function () {
      return this.isActive || !!this.value;
    },
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
