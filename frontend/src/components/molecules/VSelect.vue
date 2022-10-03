<template>
  <div class="component inline">
    <button class="input select" type="button" @click="isExpanded = true" @blur="isExpanded = false">
      <icon v-if="prefixIcon" :fa-icon="prefixIcon" class="prefix-icon" />
      <span>{{ label }}</span>
    </button>
    <dropdown v-if="isExpanded" :items="items" @select="handleSelection" />
  </div>
</template>

<script>
import Dropdown from "@/components/atoms/Dropdown.vue";
import Icon from "@/components/atoms/Icon.vue";
export default {
  name: "VSelect",
  components: {
    Dropdown,
    Icon,
  },
  props: {
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
    label: {
      type: String,
      required: true,
    },
    prefixIcon: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      isExpanded: false,
    };
  },
  methods: {
    handleSelection(event) {
      this.$emit("select", event);
    },
  },
};
</script>

<style lang="scss" scoped>
.select {
  background: lightblue;
  border: none;
  border-radius: 6px;
  //padding: 12px;
}
.prefix-icon {
  padding-right: 4px;
}
</style>