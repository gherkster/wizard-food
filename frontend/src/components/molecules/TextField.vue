<template>
  <div class="form-container">
    <div class="form-input-container">
      <div :class="formInputClass" @click.self="$refs.inputField.focus()">
        <input-label :label="label" :is-active="isFieldActive" />
        <span v-if="prefix" class="form-input-prefix">{{ prefix }}</span>
        <label>
          <input ref="inputField" :value="value" :name="path" class="form-input-field" @input="input" @focus="focus" @blur="blur" />
        </label>
        <icon v-if="suffixIcon" :fa-icon="suffixIcon" :class="suffixIconClass" @click="clickIcon" />
      </div>
      <div class="form-validation-message">
        <validation-message v-show="error">{{ error }}</validation-message>
      </div>
    </div>
  </div>
</template>

<script>
import InputLabel from "@/components/atoms/InputLabel";
import ValidationMessage from "@/components/atoms/ValidationMessage";
import Icon from "@/components/atoms/Icon";

export default {
  name: "TextField",
  components: { Icon, InputLabel, ValidationMessage },
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
    error: {
      type: String,
      required: false,
      default: "",
    },
    prefix: {
      type: String,
      required: false,
      default: "",
    },
    suffixIcon: {
      type: String,
      required: false,
      default: "",
    },
    suffixIconDisabled: {
      type: Boolean,
      required: false,
      default: false,
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
    suffixIconClass: function () {
      return this.suffixIconDisabled ? "form-input-suffix-icon__disabled" : "form-input-suffix-icon";
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
    clickIcon() {
      if (!this.suffixIconDisabled) {
        this.$emit("clickIcon");
      }
    },
  },
};
</script>
