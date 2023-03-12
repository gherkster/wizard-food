<template>
  <x-row>
    <x-column col-3>
      <x-input
        label="Minutes"
        path="minutes"
        input-mode="numeric"
        :value="props.duration.minutes || ''"
        :errors="v$.duration.minutes.$errors"
        @input="onMinuteInput"
        @blur="v$.duration.minutes.$touch()"
      />
    </x-column>
    <x-column col-3>
      <x-input
        label="Hours"
        path="hours"
        input-mode="numeric"
        :value="props.duration.hours || ''"
        :errors="v$.duration.hours.$errors"
        @input="onHourInput"
        @blur="v$.duration.hours.$touch()"
      />
    </x-column>
    <x-column col-3>
      <x-input
        label="Days"
        path="days"
        input-mode="numeric"
        :value="props.duration.days || ''"
        :errors="v$.duration.days.$errors"
        @input="onDayInput"
        @blur="v$.duration.days.$touch()"
      />
    </x-column>
    <x-column col-3>
      <x-select
        v-if="custom"
        path="name"
        label="Label"
        filterable
        tag
        :value="props.duration.name"
        :options="customTimeTypes"
        :errors="v$.duration.name.$errors"
        @input="onLabelInput"
        @blur="v$.duration.name.$touch()"
      />
    </x-column>
  </x-row>
</template>

<script setup lang="ts">
import { XColumn, XInput, XRow, XSelect } from "@/components";
import { integer, minValue, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { computed } from "vue";
import { RecipeDuration } from "@/types/recipe";
import { ValueLabelPair } from "@/types/form";

const props = defineProps<{
  duration: RecipeDuration;
  custom: boolean;
  customTimeTypes: Array<ValueLabelPair>;
}>();

const validationRules = computed(() => {
  const timeValidation = {
    integer,
    minValue: minValue(0),
  };

  const rules = {
    duration: {
      minutes: timeValidation,
      hours: timeValidation,
      days: timeValidation,
      name: {},
    },
  };

  // Make the custom name field required if the user enters any time component values
  if (props.custom && (props.duration.minutes || props.duration.hours || props.duration.days)) {
    rules.duration.name = {
      required,
    };
  }

  return rules;
});

const v$ = useVuelidate(validationRules, props);

const emit = defineEmits<{
  (e: "input", value: RecipeDuration): void;
}>();
function onMinuteInput(value: number) {
  emit("input", {
    ...props.duration,
    minutes: value,
  });
}

function onHourInput(value: number) {
  emit("input", {
    ...props.duration,
    hours: value,
  });
}

function onDayInput(value: number) {
  emit("input", {
    ...props.duration,
    days: value,
  });
}

function onLabelInput(value: string) {
  emit("input", {
    ...props.duration,
    name: value,
  });
}
</script>

<style scoped lang="scss">
@use "@/styles/_mixins" as m;
.row {
  @include m.spacing("gx", "xs");
  > div {
    flex: 1 1 0;
  }
}
</style>
