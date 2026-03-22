<template>
  <div class="badge">
    <slot />
  </div>
</template>

<style lang="scss">
@use "@/styles/variables" as v;
$badge-size: 20px;
.badge {
  display: flex;
  justify-content: center;
  align-items: center;
  width: $badge-size;
  height: $badge-size;
  line-height: $badge-size;
  box-sizing: content-box;
  border-radius: 50%;
  text-align: center;
  font-size: 0.9rem;
  font-weight: v.$font-weight-bold;
  border: var(--theme-border-primary);
  padding: 4px;
}
</style>
