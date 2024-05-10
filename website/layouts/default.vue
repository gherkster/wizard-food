<template>
  <div>
    <nuxt-loading-indicator :duration="1000" :throttle="500" :height="3" :color="false" />
    <header class="nav-header">
      <div class="nav-header__options">
        <Icon name="my-icons:logo" size="88" />
        <nuxt-link to="/"> Home </nuxt-link>
        <nuxt-link to="/recipes">Recipes</nuxt-link>
        <v-search :value="query" class="nav-header-search" @input="search" @search="search" />
      </div>
    </header>
    <div class="page content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const searchClient = useSearch();
// Ensure the search index exists on each page load,
// so that if it is missing it can trigger a background download
searchClient.ensureIndex();

const route = useRoute();

const initialQuery = route.query.search && typeof route.query.search === "string" ? route.query.search : null;

// Prefill the search box with the previously searched for query if one exists
// This is only relevant for a page reload or following a search link
const query = ref(initialQuery ?? "");

// Keep input value in sync with the url query param
watch(
  () => route.query.search,
  (urlSearch) => {
    if (typeof route.query.search !== "string") {
      query.value = "";
      return;
    }
    query.value = urlSearch?.toString() ?? "";
  },
);

async function search(value: string) {
  query.value = value;
  const trimmedQuery = query.value.trim();
  /*
  navigateTo.replace is used below so that each keystroke of a search does not push a new entry into the browser history
  The initial navigation to the search results is considered part of the history if the user was not searching before,
  but any subsequent key presses triggering searches should not add to the browser history
  */
  if (trimmedQuery.length === 0) {
    await navigateTo("/recipes", {
      replace: !!route.query.search,
    });
  }

  if (trimmedQuery.length < 4) {
    // TODO: Indicate minimum length
    return;
  }

  await navigateTo({
    path: "/recipes",
    replace: !!route.query.search,
    query: {
      search: trimmedQuery,
    },
  });
}
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;

.nav-header {
  display: flex;
  @include m.spacing("pt", "xs");
  @include m.spacing("px", "xs");
  //@include m.spacing("pb", "xs");

  &__options {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    @include m.spacing("gx", "xs");
    @include m.spacing("gy", "sm");
    > a {
      @include m.spacing("p", "xxs");
    }
    .nav-header-search {
      width: 200px;
      margin-left: auto;
    }
  }
}
</style>

<style lang="scss">
.nuxt-loading-indicator {
  background-color: var(--theme-color-primary);
}
</style>
