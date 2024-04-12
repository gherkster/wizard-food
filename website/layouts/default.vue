<template>
  <div>
    <header class="nav-header">
      <div class="nav-header__links">
        <span>Home</span>
        <span>Recipes</span>
        <span>Categories</span>
        <span>About</span>
      </div>
      <recipe-search class="nav-header__search" />
    </header>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;

.nav-header {
  display: flex;
  align-items: center;
  // TODO Colour variables
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  @include m.spacing("py", "xs");
  @include m.spacing("px", "sm");
  &__links {
    display: flex;
    @include m.spacing("gx", "sm");
  }
  &__search {
    margin-left: auto;
  }
}
</style>
