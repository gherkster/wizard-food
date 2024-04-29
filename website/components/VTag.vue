<template>
  <div class="tag">
    <slot />
  </div>
</template>

<style scoped lang="scss">
@use "@/styles/variables" as v;
$tag-size: 12px;
.tag {
  border: v.$border-primary;
  padding: 4px 8px;

  height: $tag-size;
  line-height: $tag-size;
  border-radius: v.$border-radius-md;
  text-align: center;
  font-size: 16px;
  padding: 8px;
}
</style>
