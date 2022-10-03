<template>
  <div class="component inline">
    <button class="form-input" :disabled="disabled" type="button" @click="handleButtonClick">
      <icon v-if="loading" class="button-icon" fa-icon="fa-spinner" spin />
      <span v-show="!loading" class="button-label">
        <slot />
      </span>
    </button>
  </div>
</template>

<script>
import Icon from "@/components/atoms/Icon.vue";
export default {
  name: "VButton",
  components: { Icon },
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    handleButtonClick() {
      this.$emit("click");
    },
  },
};
</script>
