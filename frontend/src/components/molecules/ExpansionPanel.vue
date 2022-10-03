<template>
  <div>
    <button type="button" class="form-expansion-button" @click="isActive = !isActive">{{ label }}</button>
    <div v-if="isActive" class="form-expansion-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpansionPanel",
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isActive: false,
  }),
};
</script>
