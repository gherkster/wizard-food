<template>
  <div :class="alertClass">
    <n-alert :title="message" :type="severity" />
  </div>
</template>

<script>
import { NAlert } from "naive-ui";
import { Severity } from "@/constants/enums";

export default {
  name: "TimedAlert",
  components: {
    NAlert,
  },
  props: {
    severity: {
      default: Severity.INFO,
      required: false,
      type: String,
      validator(sev) {
        return Object.values(Severity).includes(sev);
      },
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
