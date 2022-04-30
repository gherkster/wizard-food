<template>
  <div class="form-container">
    <div class="form-input-container">
      <div :class="formInputClass">
        <input-label :label="label" :is-active="isLabelActive" />
        <slot :on-input="input" :on-focus="focus" :on-blur="blur" :on-enter="enter" :is-active="isActive" />
      </div>
    </div>
    <div class="form-validation-message">
      <validation-message v-show="errors && errors.length > 0">{{ errors[0] }}</validation-message>
    </div>
  </div>
</template>

<script>
import InputLabel from "@/components/atoms/InputLabel";
import ValidationMessage from "@/components/atoms/ValidationMessage";
import { number, string, ValidationError } from "yup";

export default {
  name: "FormInput",
  components: {
    InputLabel,
    ValidationMessage,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      required: true,
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    numeric: {
      type: Boolean,
      required: false,
      default: false,
    },
    integer: {
      type: Boolean,
      required: false,
      default: false,
    },
    maxLength: {
      type: Number,
      required: false,
      default: 10000,
    },
  },
  data: () => ({
    isActive: false,
    errors: [],
  }),
  computed: {
    isLabelActive: function () {
      return this.isActive || !!this.value;
    },
    formInputClass: function () {
      return this.errors && this.errors.length > 0 ? "form-input__error" : "form-input";
    },
  },
  methods: {
    async input(event) {
      console.log("input", event.target.value);
      this.$parent.$emit("input", event.target.value);
      await this.validate(event.target.value);
    },
    async enter(value) {
      console.log(value);
      this.$parent.$emit("enter", value);
      await this.validate(value);
    },
    focus(event) {
      this.isActive = true;
      this.$parent.$emit("focus", event.target.value);
    },
    async blur(event) {
      this.isActive = false;
      this.$parent.$emit("blur", event.target.value);
      await this.validate(event.target.value);
    },
    async validate(value) {
      let schema;

      if (this.numeric || this.integer) {
        schema = number().transform((cv, ov) => {
          return ov === "" ? undefined : cv;
        });
      } else {
        schema = string();
      }

      if (this.required) {
        schema = schema.required(this.label + " is required");
      }

      if (this.numeric || this.integer) {
        schema = schema.typeError(this.label + " must be a number").min(0, this.label + " must be positive");
        if (this.integer) {
          schema = schema.integer(this.label + " must be an integer");
        }
      }
      schema = schema.max(this.maxLength, this.label + " should not exceed ${max} characters");

      try {
        await schema.validate(value);
        this.errors = [];
      } catch (e) {
        if (e instanceof ValidationError) {
          this.errors = e.errors;
        }
      }
    },
  },
};
</script>
