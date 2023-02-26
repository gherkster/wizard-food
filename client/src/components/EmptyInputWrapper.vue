<template>
  <div class="n-input __input-l n-input--textarea n-input--autosize n-input--stateful" tabindex="-1" @focus="$emit('focus', $event)">
    <div class="n-input-wrapper">
      <div class="n-input__textarea n-scrollbar __scrollbar" role="none">
        <slot class="n-input__textarea-el" />
        <div class="n-input__textarea-mirror" style="min-height: 113.5px; max-height: 305.5px"></div>
      </div>
      <div
        class="n-scrollbar-rail n-scrollbar-rail--vertical n-scrollbar-rail--disabled"
        data-scrollbar-rail="true"
        aria-hidden="true"
      ></div>
    </div>
    <div class="n-input__border"></div>
    <div class="n-input__state-border"></div>
  </div>
</template>

<script>
export default {
  name: "EmptyInputWrapper",
};
</script>
