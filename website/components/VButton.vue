<template>
  <button class="v-button" :class="{ 'btn-primary': primary }" @click="emit('click')">
    <span><slot /></span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    primary?: boolean;
  }>(),
  {
    primary: true,
  },
);

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
  @include m.spacing("px", "xs");
  @include m.spacing("py", "xxs");
  //pointer-events: none;
  //background-color: transparent;
  font-size: $button-size;
  line-height: $button-size;
  &.btn-primary {
    background-color: v.$colour-primary;
    &:hover {
      // TODO: Decide on a colour
      background-color: red;
    }
  }
}
</style>
