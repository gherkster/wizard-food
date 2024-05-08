<template>
  <div class="badge">
    <slot />
  </div>
</template>

<style lang="scss">
@use "@/styles/variables" as v;
$badge-size: 18px;
.badge {
  width: $badge-size;
  height: $badge-size;
  line-height: $badge-size;
  box-sizing: content-box;
  border-radius: 50%;
  text-align: center;
  font-size: 16px;
  border: var(--theme-border-primary);
  padding: 4px;
}
</style>
