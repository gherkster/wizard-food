<template>
  <x-row>
    <x-column col-3>
      <x-input
        label="Minutes"
        path="minutes"
        input-mode="numeric"
        :value="minutes"
        :errors="v$.minutes.$errors"
        @input="handleInput"
        @blur="handleBlur"
      />
    </x-column>
    <x-column col-3>
      <x-input
        label="Hours"
        path="hours"
        input-mode="numeric"
        :value="hours"
        :errors="v$.hours.$errors"
        @input="handleInput"
        @blur="handleBlur"
      />
    </x-column>
    <x-column col-3>
      <x-input
        label="Days"
        path="days"
        input-mode="numeric"
        :value="days"
        :errors="v$.days.$errors"
        @input="handleInput"
        @blur="handleBlur"
      />
    </x-column>
    <x-column col-3>
      <x-select
        v-if="custom"
        path="name"
        label="Label"
        filterable
        tag
        :value="customName"
        :options="customTimeTypes"
        :errors="v$.customName.$errors"
        @input="handleInput"
        @blur="handleBlur"
      />
    </x-column>
  </x-row>
</template>

<script>
import { XColumn, XInput, XRow, XSelect } from "@/components";
import { integer, minValue, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { computed } from "vue";

export default {
  name: "Duration",
  inheritAttrs: false,
  components: {
    XColumn,
    XInput,
    XRow,
    XSelect,
  },
  setup(props) {
    const validationRules = computed(() => {
      const timeValidation = {
        integer,
        minValue: minValue(0),
      };

      const rules = {
        minutes: timeValidation,
        hours: timeValidation,
        days: timeValidation,
        customName: {},
      };

      // Make the custom name field required if the user enters any time component values
      if (props.custom && (props.minutes || props.hours || props.days)) {
        rules.customName = {
          required,
        };
      }

      return rules;
    });

    return {
      v$: useVuelidate(validationRules, props),
    };
  },
  props: {
    minutes: {
      type: String,
      required: true,
    },
    hours: {
      type: String,
      required: true,
    },
    days: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    custom: {
      type: Boolean,
      required: false,
      default: false,
    },
    customName: {
      type: String,
      required: false,
      default: "",
    },
    customTimeTypes: {
      type: Array,
      required: false,
      default: () => [],
    },
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
      if (this.v$.customName) {
        this.v$.customName.$touch();
      }
    },
  },
};
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
