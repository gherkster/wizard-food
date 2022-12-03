<template>
  <div :class="alertClass">
    {{ message }}
  </div>
</template>

<script>
import { Severity } from "@/constants/enums";

export default {
  name: "TimedAlert",
  props: {
    severity: {
      default: Severity.INFO,
      required: false,
      type: String,
    },
    message: {
      required: true,
      type: String,
    },
    displayDuration: {
      type: Number,
      required: false,
      default: 4000,
    },
  },
  computed: {
    alertClass: function () {
      return "alert--" + this.severity;
    },
  },
  mounted() {
    setTimeout(() => {
      this.$emit("expired");
    }, this.displayDuration);
  },
};
</script>
