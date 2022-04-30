<template>
  <span class="form-chip">{{ label }}</span>
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
};
</script>

<style scoped>

</style>