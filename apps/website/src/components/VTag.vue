<template>
  <div class="tag">
    <span v-if="iconName" class="tag__icon" aria-hidden="true">⌕</span>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  iconName?: string;
}>();
</script>

<style scoped lang="scss">
@use "../styles/mixins" as m;
@use "../styles/variables" as v;

$tag-size: 12px;

.tag {
  display: flex;
  align-items: center;
  box-sizing: content-box;
  border: var(--theme-border-primary);
  height: $tag-size;
  line-height: $tag-size;
  border-radius: v.$border-radius-md;
  text-align: center;
  font-size: 1rem;
  padding: 8px;

  @include m.spacing("gx", "xxs");
}

.tag__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
}
</style>
