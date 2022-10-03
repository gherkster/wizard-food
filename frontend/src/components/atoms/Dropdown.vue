<template>
  <div class="dropdown-container">
    <div v-for="(item, index) in items" class="dropdown-item" :key="item" @mousedown="handleDropdownSelection($event, index)">
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script>
import EmittedValue from "@/models/EmittedValue";

export default {
  name: "Dropdown",
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handleDropdownSelection(event, index) {
      this.$emit("select", new EmittedValue(event.target.textContent.trim(), index));
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-container {
  background: white;
  z-index: 2;
  position: absolute;
  left: 0;
  top: calc(100% - 20px); // TODO: calculate dynamically
  width: calc(100% - 20px);
}
.dropdown-item {
  background: lightsteelblue;
  padding: 8px 8px;
  color: black;
  cursor: pointer;
  &:hover {
  }
}
</style>
