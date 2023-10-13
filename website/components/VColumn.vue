<template>
  <div :class="Object.keys($attrs)">
    <slot />
  </div>
</template>

<script>
export default {
  name: "XColumn",
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
};
</script>
