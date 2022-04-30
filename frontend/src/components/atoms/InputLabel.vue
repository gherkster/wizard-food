<template>
  <span :class="spanClass">{{ label }}</span>
</template>

<script>
export default {
  name: "InputLabel",
  props: {
    label: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    spanClass: function () {
      return this.isActive ? "field-label__active" : "field-label";
    },
  },
};
</script>

<style scoped lang="scss">
@use "./src/styles/variables";
span {
  color: variables.$colour-font-muted;
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  margin: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
}
.field-label {
  transition: transform 0.2s, font-size 0.2s;
  &__active {
    @extend .field-label;
    font-size: 0.7rem;
    transform: translateY(-1.35em);
  }
}
</style>
