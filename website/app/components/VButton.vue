<template>
  <button class="control v-button" :class="classes" :disabled="disabled" @click="onClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    primary?: boolean;
    transparent?: boolean;
    disabled?: boolean;
    size?: "inline" | "small" | "medium" | "large";
  }>(),
  {
    primary: true,
    size: "medium",
  },
);

const classes = computed(() => {
  const isVisuallyPrimary = props.primary && !props.transparent;

  return {
    "btn-primary": isVisuallyPrimary,
    "btn-transparent": props.transparent,
    [props.size]: props.size,
  };
});

const emit = defineEmits<{
  click: [];
}>();

const onClick = () => {
  if (!props.disabled) {
    emit("click");
  }
};
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;

.v-button {
  width: fit-content;
  border-style: none;
  border-radius: v.$border-radius-sm;
  font-size: 1rem;
  line-height: 1rem;

  @include m.spacing("px", "sm");
  @include m.spacing("py", "xs");

  &:hover:not(:disabled) {
    cursor: pointer;
    filter: brightness(85%);
  }

  &:active:not(:disabled) {
    transform: scale(0.97) translateY(1px);
    filter: brightness(80%); // Darker than hover to simulate depth
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: none;
    transform: none;
  }

  &.btn-primary {
    background-color: var(--theme-color-primary);
  }

  &.btn-transparent {
    background-color: transparent;
  }

  &.large {
    min-width: 140px;
  }

  &.small {
    @include m.spacing("p", "xxs");
  }

  &.inline {
    padding: 0;
    line-height: inherit;
  }
}
</style>
