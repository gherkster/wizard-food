<template>
  <font-awesome-icon
    :icon="faIcon"
    :size="size"
    :spin="spin"
    style="cursor: pointer"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  ></font-awesome-icon>
</template>

<script>
export default {
  name: "Icon",
  props: {
    faIcon: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: false,
      default: "lg",
    },
    spin: {
      type: Boolean,
      required: false,
      default: false,
    },
    hover: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    handleMouseEnter() {
      this.$emit("mouseenter");
    },
    handleMouseLeave() {
      this.$emit("mouseleave");
    },
    handleClick() {
      this.$emit("click");
    },
  },
};
</script>
