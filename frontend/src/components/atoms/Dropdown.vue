<template>
  <div class="form-dropdown-container">
    <div
      v-for="item in items"
      class="form-dropdown-item"
      :key="item"
      @mousedown="mousedown"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Dropdown",
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    mousedown(event) {
      this.$emit("select", event.target.textContent.trim());
    },
  },
};
</script>
