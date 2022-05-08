<template>
  <div class="form-input-container">
    <button class="form-button" :class="buttonClass" :disabled="disabled" type="button" @click="$emit('click')">
      <icon v-if="loading" fa-icon="fa-spinner" spin />
      <span ref="buttonText" class="form-button-content" :class="{ 'form-button-content__hidden': loading }">
        <slot />
      </span>
    </button>
  </div>
</template>

<script>
import Icon from "@/components/atoms/Icon";
export default {
  name: "InputButton",
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
    primary: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    buttonClass: function () {
      return {
        "form-button__primary": this.primary,
      };
    },
  },
};
</script>
