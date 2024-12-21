<template>
  <span class="popover">
    <button
      ref="popoverTrigger"
      class="popover__trigger"
      aria-controls="popover-content"
      :aria-haspopup="true"
      :aria-expanded="isVisible"
      @click="isVisible = !isVisible"
    >
      <slot name="trigger" />
      <v-icon class="popover__icon" :class="{ open: isVisible }" :icon="chevron" :size="20" />
    </button>
    <div
      v-if="isVisible"
      id="popover-content"
      ref="popoverContent"
      class="popover__content"
      role="dialog"
      aria-modal="true"
    >
      <slot name="content" />
    </div>
  </span>
</template>

<script setup lang="ts">
import chevron from "~icons/gravity-ui/chevron-down";

const isVisible = ref(false);

const popoverTriggerRef = useTemplateRef("popoverTrigger");
const popoverContentRef = useTemplateRef("popoverContent");

const onOutsideClick = (event: MouseEvent) => {
  if (
    popoverContentRef.value &&
    !popoverContentRef.value.contains(event.target as HTMLElement) &&
    popoverTriggerRef.value &&
    !popoverTriggerRef.value.contains(event.target as HTMLElement)
  ) {
    isVisible.value = false; // Close the popover if clicked outside
  }
};

onMounted(() => {
  document.addEventListener("mousedown", onOutsideClick);
});
onUnmounted(() => {
  document.removeEventListener("mousedown", onOutsideClick);
});
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;

.popover {
  position: relative;

  &__trigger {
    display: inline-flex;
    align-items: center;
    background-color: transparent;
    padding: 0;
    border: none;
    cursor: pointer;
  }

  &__icon {
    margin-left: 8px;
    transition: 0.15s;

    &.open {
      transform: rotate(-180deg);
    }
  }

  &__content {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 10px;
    background-color: var(--theme-body-overlay-color);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: v.$border-radius-sm;
    z-index: 1000;
    white-space: nowrap;

    @include m.spacing("p", "sm");
  }
}
</style>
