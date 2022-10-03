<template>
  <div class="component responsive">
    <div>
      <span class="form-input-label">{{ label }}</span>
      <div :class="formInputClass" @click.self="$refs.inputField.focus()">
        <label class="form-combo-box">
          <input
            ref="inputField"
            :value="value"
            :name="path"
            class="form-input-field form-combo-box-input"
            @input="input"
            @focus="focus"
            @blur="blur"
          />
        </label>
        <dropdown v-if="isActive" :items="items" @select="select" />
        <icon fa-icon="fa-chevron-down" class="form-combo-box-icon" />
        <!-- TODO: Animate -->
      </div>
      <div class="form-validation-message">
        <validation-message v-show="error">{{ error }}</validation-message>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from "@/components/atoms/Dropdown";
import ValidationMessage from "@/components/atoms/ValidationMessage";
import Icon from "@/components/atoms/Icon";

export default {
  name: "ComboBox",
  components: { Icon, ValidationMessage, Dropdown },
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
    items: {
      type: Array,
      required: true,
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
    select(value) {
      this.$emit("input", { path: this.path, value: value });
    },
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
