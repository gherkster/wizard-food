<template>
  <div class="servings-adjuster">
    <div class="servings-adjuster__control">
      <v-icon :icon="minus" :size="32" :class="{ disabled: servings <= 1 }" @click="decrementServings" />
      <span>
        <span class="servings-adjuster__amount"
          ><b>{{ servings }}&nbsp;</b></span
        >
        <span>{{ label }}</span>
      </span>
      <v-icon :icon="plus" :size="32" @click="incrementServings" />
    </div>
  </div>
</template>

<script setup lang="ts">
import minus from "~icons/gravity-ui/circle-minus";
import plus from "~icons/gravity-ui/circle-plus";

const props = withDefaults(
  defineProps<{
    servings: number;
    label?: string;
  }>(),
  {
    label: "servings",
  },
);

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
  @include m.spacing("gx", "xs");

  &__control {
    display: flex;
    align-items: center;
    user-select: none;
    .icon {
      cursor: pointer;
      color: var(--theme-color-primary);
    }
    > span:not(.icon) {
      // Match extra space on the left side reserved for larger numbers
      margin-right: 0.7em;
    }
    > .disabled {
      cursor: not-allowed;
      opacity: 50%;
    }
  }
  &__amount {
    text-align: right;
    display: inline-block;
    // Reserve space for larger numbers to avoid minus icon jumping around
    min-width: 1.7em;
  }
}
</style>
