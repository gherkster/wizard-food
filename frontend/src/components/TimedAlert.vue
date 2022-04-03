<template>
  <v-alert :type="severity">
    {{ message }}
  </v-alert>
</template>

<script>
import { AlertKeys, Severity } from "@/constants/enums";

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
  },
  data: () => ({
    currentDuration: 0,
    displayDuration: 4000,
  }),
  created() {
    setTimeout(() => {
      this.$emit(AlertKeys.REMOVE);
    }, this.displayDuration);
  },
};
</script>

<style scoped></style>
