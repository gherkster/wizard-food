<template>
  <transition name="slide">
    <span>
      <small>
        <slot />
      </small>
    </span>
  </transition>
</template>

<script>
export default {
  name: "ValidationMessage",
};
</script>

<style scoped lang="scss">
@use "./src/styles/variables";
span {
  position: absolute;
  left: 12px;
  bottom: -8px;
  color: variables.$colour-error;
  line-height: 0.875em;
}
.slide-enter-active {
  transition: opacity 0.3s ease, transform 0.3s;
}
.slide-enter {
  opacity: 0;
  transform: translateY(-0.5em);
}
</style>
