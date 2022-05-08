<template>
  <div class="form-container">
    <div class="form-input-container">
      <div :class="formInputClass" @click.self="$refs.chipsInput.focus()">
        <input-label :label="label" :is-active="isFieldActive" />
        <div class="form-chip-container">
          <chip v-for="chip in value" :label="chip" :key="chip" @remove="deleteChip" />
          <label class="form-combo-box">
            <input
              ref="chipsInput"
              :name="path"
              class="form-input-field"
              @keydown.enter="enter"
              @keydown.delete="deleteLastChip"
              @focus="focus"
              @blur="blur"
            />
          </label>
        </div>
        <dropdown v-show="isActive" :items="items" @select="select" />
        <icon fa-icon="fa-chevron-down" class="form-combo-box-icon" /><!-- TODO: Animate -->
      </div>
      <div class="form-validation-message">
        <validation-message v-show="error">{{ error }}</validation-message>
      </div>
    </div>
  </div>
</template>

<script>
import InputLabel from "@/components/atoms/InputLabel";
import Dropdown from "@/components/atoms/Dropdown";
import ValidationMessage from "@/components/atoms/ValidationMessage";
import Chip from "@/components/atoms/Chip";
import Icon from "@/components/atoms/Icon";

export default {
  name: "ChipBox",
  components: { Icon, Chip, InputLabel, ValidationMessage, Dropdown },
  props: {
    value: {
      type: Set,
      required: true,
      default: () => [],
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
      return this.isActive || this.value.size > 0;
    },
    formInputClass: function () {
      return this.error ? "form-input__error" : "form-input";
    },
  },
  methods: {
    select(value) {
      this.createChip(value);
    },
    enter(event) {
      this.createChip(event.target.value);
    },
    createChip(chip) {
      if (chip.trim() === "") {
        return;
      }
      let chips = this.value.add(chip.trim());
      this.$emit("input", { path: this.path, value: Array.from(chips) });
      this.$refs.chipsInput.value = "";
    },
    deleteLastChip() {
      if (this.value.size > 0 && this.$refs.chipsInput.value === "") {
        let chips = Array.from(this.value).slice(0, -1); // Remove last chip in set
        this.$emit("input", { path: this.path, value: chips });
      }
    },
    deleteChip(label) {
      let chips = this.value;
      chips.delete(label);
      this.$emit("input", { path: this.path, value: Array.from(chips) });
    },
    focus() {
      this.isActive = true;
      this.$emit("focus", { path: this.path, value: this.value });
    },
    blur() {
      this.isActive = false;
      this.$emit("blur", { path: this.path, value: this.value });
    },
  },
};
</script>
