<template>
  <button class="control v-button" :class="classes" @click="emit('click')">
    <span class="control__label"><slot /></span>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    primary?: boolean;
    transparent?: boolean;
    size?: "small" | "medium" | "large";
  }>(),
  {
    primary: true,
    size: "medium",
  },
);

const classes = computed(() => {
  return {
    "btn-primary": props.primary,
    "btn-transparent": props.transparent,
    [props.size]: props.size,
  };
});

const emit = defineEmits<{
  click: [];
}>();
</script>

<style lang="scss" scoped>
// TODO: Use font size variable
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;
$button-size: 16px;
.v-button {
  width: fit-content;
  border-style: none;
  border-radius: v.$border-radius-sm;
  @include m.spacing("px", "sm");
  @include m.spacing("py", "xs");
  //pointer-events: none;
  //background-color: transparent;
  font-size: $button-size;
  line-height: $button-size;
  &:hover {
    cursor: pointer;
  }

  &.btn-primary {
    background-color: var(--theme-color-primary);
    &:hover {
      background-color: var(--theme-color-active);
    }
  }
  &.btn-transparent {
    background-color: transparent;
    &:hover {
      background-color: transparent;
    }
  }
  &.large {
    min-width: 140px;
  }
  &.small {
    @include m.spacing("p", "xxs");
  }
}
</style>
