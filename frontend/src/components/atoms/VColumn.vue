<template>
  <div :style="styleObject">
    <slot />
  </div>
</template>

<script>
export default {
  name: "VColumn",
  props: {
    left: {
      type: Boolean,
      required: false,
      default: true,
    },
    middle: {
      type: Boolean,
      required: false,
      default: false,
    },
    right: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    styleObject() {
      return {
        "justify-content": this.middle ? "center" : this.right ? "right" : "left",
      };
    },
  },
};
</script>
