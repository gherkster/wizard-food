<template>
  <x-row class="list-item ingredient">
    <x-column col-6 col-md-2 col-lg-2>
      <x-input
        label="Amount"
        input-mode="numeric"
        :value="data.amount"
        :errors="v$.amount.$errors"
        @input="onAmountInput"
        @blur="v$.amount.$touch()"
      />
    </x-column>
    <x-column col-6 col-md-2 col-lg-2>
      <x-select
        label="Units"
        :value="data.unit"
        filterable
        tag
        clearable
        :options="props.unitOptions"
        @input="onUnitInput"
        @blur="onUnitInput"
      />
    </x-column>
    <x-column col-12 col-md-4 col-lg-4>
      <x-input
        label="Ingredient"
        required
        :value="data.name"
        :errors="v$.name.$errors"
        @input="onNameInput"
        @blur="v$.name.$touch()"
      />
    </x-column>
    <x-column col-12 col-md-2 col-lg-3>
      <x-input label="Notes" :value="data.note" @input="onNoteInput" />
    </x-column>
    <slot name="end" />
  </x-row>
</template>

<script setup lang="ts">
import { XInput, XSelect, XRow, XColumn } from "@/components";
import { useVuelidate } from "@vuelidate/core";
import { required, numeric, or, helpers } from "@vuelidate/validators";
import { fraction } from "@/scripts/validation";
import { ValueLabelPair } from "@/types/form";
import { Ingredient, IngredientFraction } from "@/types/recipe";
import { computed, reactive } from "vue";
import Fraction from "fraction.js";

const props = defineProps<{
  ingredient: Ingredient;
  unitOptions: Array<ValueLabelPair>;
}>();

// Copy the props into a separate mutable data object, where the amount type is a string
// This means the validation can happen on the string, and we can convert it to a proper fraction when emitting
const data = reactive({
  amount:
    props.ingredient.amount && props.ingredient.amount.numerator > 0
      ? new Fraction(props.ingredient.amount.numerator, props.ingredient.amount.denominator).toFraction(true)
      : "",
  unit: props.ingredient.unit,
  name: props.ingredient.name,
  note: props.ingredient.note,
});

const rules = {
  amount: {
    numericFraction: helpers.withMessage("Value must be a number or fraction", or(numeric, fraction)),
  },
  name: {
    required,
  },
};

const v$ = useVuelidate(rules, data);

const emit = defineEmits<{
  (e: "input", value: Ingredient): void;
}>();
function onAmountInput(value: string) {
  data.amount = value;
  if (validAmountFraction.value) {
    emit("input", { ...data, amount: validAmountFraction.value });
  }
}
function onUnitInput(value: string) {
  data.unit = value;
  if (validAmountFraction.value) {
    emit("input", { ...data, amount: validAmountFraction.value });
  }
}
function onNameInput(value: string) {
  data.name = value;
  if (validAmountFraction.value) {
    emit("input", { ...data, amount: validAmountFraction.value });
  }
}
function onNoteInput(value: string) {
  data.note = value;
  if (validAmountFraction.value) {
    emit("input", { ...data, amount: validAmountFraction.value });
  }
}

const validAmountFraction = computed<IngredientFraction | null>(() => {
  if (data.amount && v$.value.amount.$silentErrors.length === 0) {
    const fraction = new Fraction(data.amount);
    return {
      numerator: fraction.n,
      denominator: fraction.d,
    };
  }
  return null;
});
</script>

<style scoped lang="scss">
.ingredient {
  margin: unset;
}
</style>
