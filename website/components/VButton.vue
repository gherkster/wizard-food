<template>
  <button class="v-button" :class="{ active: active }">
    <span><slot /></span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  active?: boolean;
}>();
</script>

<style lang="scss" scoped>
// TODO: Use font size variable
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;
$button-size: 16px;
.v-button {
  border-style: none;
  @include m.spacing("px", "xs");
  @include m.spacing("py", "xxs");
  //pointer-events: none;
  //background-color: transparent;
  font-size: $button-size;
  line-height: $button-size;
  span {
    //background-color: yellow;
    //color: red;
  }
}
.active {
  background-color: v.$colour-active;
}
</style>
