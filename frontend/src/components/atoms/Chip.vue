<template>
  <div class="form-chip" :class="{ 'form-chip__active': isActive }" tabindex="-1" @click="click" @blur="blur">
    <span>{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: "Chip",
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isActive: false,
  }),
  methods: {
    click() {
      if (!this.isActive) {
        this.isActive = true;
      } else {
        this.$emit("remove", this.label);
      }
    },
    blur() {
      this.isActive = false;
    },
  },
};
</script>
