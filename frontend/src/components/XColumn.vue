<template>
  <div :class="'col-' + cols" :style="styleObject">
    <slot />
  </div>
</template>

<script>
export default {
  name: "XColumn",
  props: {
    cols: {
      type: Number,
      required: false,
      default: 12,
    },
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
