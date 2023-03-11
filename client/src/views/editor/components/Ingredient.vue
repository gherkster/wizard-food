<template>
  <x-row class="list-item ingredient">
    <x-column col-6 col-md-2 col-lg-2>
      <x-input
        ref="amount"
        path="amount"
        label="Amount"
        input-mode="numeric"
        :value="amount"
        :errors="v$.amount.$errors"
        :show-label="showLabels"
        @input="handleInput"
        @blur="handleBlur"
      />
    </x-column>
    <x-column col-6 col-md-2 col-lg-2>
      <x-select
        ref="unit"
        path="unit"
        label="Units"
        :value="unit"
        :show-label="showLabels"
        filterable
        tag
        clearable
        :options="unitOptions"
        @input="handleInput"
        @blur="handleBlur"
      />
    </x-column>
    <x-column col-12 col-md-4 col-lg-4>
      <x-input
        ref="name"
        path="name"
        label="Ingredient"
        required
        :value="name"
        :errors="v$.name.$errors"
        :show-label="showLabels"
        @input="handleInput"
        @blur="handleBlur"
      />
    </x-column>
    <x-column col-12 col-md-2 col-lg-3>
      <x-input ref="note" path="note" label="Notes" :value="note" :show-label="showLabels" @input="handleInput" @blur="handleBlur" />
    </x-column>
    <slot name="end" />
  </x-row>
</template>

<script>
import { XInput, XSelect, XRow, XColumn } from "@/components";
import { useVuelidate } from "@vuelidate/core";
import { required, numeric, or, helpers } from "@vuelidate/validators";
import { fraction } from "@/scripts/validation";

export default {
  name: "Ingredient",
  inheritAttrs: false,
  components: {
    XRow,
    XColumn,
    XInput,
    XSelect,
  },
  props: {
    amount: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    unitOptions: {
      type: Array,
      required: true,
    },
    showLabels: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  validations() {
    return {
      amount: {
        numericFraction: helpers.withMessage("Value must be a number or fraction", or(numeric, fraction)),
      },
      name: {
        required,
      },
    };
  },
  methods: {
    handleInput(event) {
      this.$emit("input", event);
      if (this.v$[event.path]) {
        this.v$[event.path].$touch();
      }
    },
    handleBlur(event) {
      this.$emit("blur", event);
      if (this.v$[event.path]) {
        this.v$[event.path].$touch();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.ingredient {
  margin: unset;
}
</style>