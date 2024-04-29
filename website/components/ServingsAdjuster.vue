<template>
  <div class="servings-adjuster">
    <icon name="mdi:minus-circle" size="32" :class="{ disabled: servings <= 1 }" @click="decrementServings" />
    <span>{{ servings }}</span>
    <icon name="mdi:plus-circle" size="32" @click="incrementServings" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  servings: number;
}>();

const emit = defineEmits<{
  input: [value: number];
}>();

function decrementServings() {
  if (props.servings > 1) {
    emit("input", props.servings - 1);
  }
}

function incrementServings() {
  emit("input", props.servings + 1);
}
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;
.servings-adjuster {
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  > svg {
    cursor: pointer;
    color: v.$colour-primary;
  }
  span {
    @include m.spacing("mx", "xxs");
    text-align: center;
    min-width: 20px;
    font-weight: v.$font-weight-bold;
  }
  > .disabled {
    cursor: not-allowed;
    opacity: 50%;
  }
}
</style>
