<template>
  <n-button :type="type" :size="size" :ghost="ghost" :disabled="disabled"
    ><x-icon v-if="icon && iconPosition === 'start'" :fa-icon="icon" size="md" class="button-icon__start" /><slot /><x-icon
      v-if="icon && iconPosition === 'end'"
      :fa-icon="icon"
      size="md"
      class="button-icon__end"
  /></n-button>
</template>

<script>
import { XIcon } from "@/components";
import { NButton } from "naive-ui";

export default {
  name: "XButton",
  components: {
    NButton,
    XIcon,
  },
  props: {
    icon: {
      type: String,
      required: false,
      default: "",
    },
    iconPosition: {
      type: String,
      required: false,
      default: "start",
      validator(val) {
        return val === "start" || val === "end";
      },
    },
    type: {
      type: String,
      required: false,
      default: "primary",
    },
    size: {
      type: String,
      required: false,
      default: "large",
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    ghost: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.button-icon {
  &__start {
    margin-right: 8px;
  }
  &__end {
    margin-left: 8px;
  }
}
</style>
