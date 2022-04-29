<template>
  <div class="form-input-container">
    <button class="form-button" :class="buttonClass" type="button" @click="$emit('click')">
      {{ label }}
    </button>
  </div>
</template>

<script>
export default {
  name: "InputButton",
  props: {
    label: {
      type: String,
      required: true,
    },
    primary: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    buttonClass: function () {
      return this.primary ? "form-button__primary" : "";
    },
  },
};
</script>
