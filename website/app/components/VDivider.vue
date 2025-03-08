<template>
  <hr class="v-divider" />
</template>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;

.v-divider {
  width: 100%;
  opacity: 50%;
  border: 1px solid var(--theme-color-primary);
  @include m.spacing("my", "xs");
}
</style>
