<template>
  <div class="component responsive">
    <div>
      <span class="form-input-label">{{ label }}</span>
<!--      <div :class="formInputClass" @click.self="$refs.inputField.focus()">-->
<!--        <span v-if="prefix" class="form-input-prefix">{{ prefix }}</span>-->
<!--        <label>-->
<!--          <input ref="inputField" :value="value" :name="path" class="form-input-field" @input="input" @focus="focus" @blur="blur" />-->
<!--        </label>-->
<!--        <icon v-if="suffixIcon" :fa-icon="suffixIcon" :class="suffixIconClass" @click="clickIcon" />-->
<!--      </div>-->
      <n-input type="text" :value="value" :name="path" placeholder="" @input="input" @focus="focus" @blur="blur" />
      <div class="form-validation-message">
        <validation-message v-show="error">{{ error }}</validation-message>
      </div>
    </div>
  </div>
</template>

<script>
import ValidationMessage from "@/components/atoms/ValidationMessage.vue";
import { NInput } from "naive-ui";

export default {
  name: "TextField",
  components: { NInput, ValidationMessage },
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
  computed: {
    formInputClass: function () {
      return this.error ? "form-input__error" : "form-input";
    },
    suffixIconClass: function () {
      return this.suffixIconDisabled ? "form-input-suffix-icon__disabled" : "form-input-suffix-icon";
    },
  },
  methods: {
    input(value) {
      console.log("received event for: ", this.path, value);
      this.$emit("input", { path: this.path, value: value });
    },
    focus() {
      console.log("focused: ", this.path, this.value);
      this.$emit("focus", { path: this.path, value: this.value });
    },
    blur() {
      console.log("blurred: ", this.path, this.value);
      this.$emit("blur", { path: this.path, value: this.value });
    },
    clickIcon() {
      if (!this.suffixIconDisabled) {
        this.$emit("clickIcon");
      }
    },
  },
};
</script>
