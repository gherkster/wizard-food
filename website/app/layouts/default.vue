<template>
  <div class="layout">
    <nuxt-loading-indicator :duration="1000" :throttle="500" :height="3" :color="false" />
    <header class="nav-header">
      <div class="nav-header__options">
        <nuxt-link to="/" class="concealed"> Home </nuxt-link>
        <nuxt-link to="/recipes" class="concealed">Recipes</nuxt-link>
        <div class="nav-header-search">
          <v-icon :icon="LogoHead" :size="44" class="nav-header-search__logo" />
          <v-search
            :value="query"
            class="nav-header-search__input"
            @input="search"
            @search="search"
          />
        </div>
      </div>
    </header>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoHead from "~icons/custom/head";

const searchClient = useSearch();
/*
  Kick off a background download of the search index if it hasn't been downloaded yet.
  Periodic checks are done after page load within the versioning middleware.
  This is also needed to pull in the data from localStorage on a fresh page load.
*/
searchClient.ensureIndex();

const route = useRoute();

const initialQuery =
  route.query.search && typeof route.query.search === "string" ? route.query.search : null;

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

/** Debounce value for the search input, can be quite short since it is in-memory */
const debounceMs = 200;

const search = debounce(async (value: string) => {
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
    return;
  }

  await navigateTo({
    path: "/recipes",
    replace: !!route.query.search,
    query: {
      search: trimmedQuery,
    },
  });
  return;
}, debounceMs);
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;

.layout {
  max-width: 2000px;
  margin: 0 auto;
  padding: 2rem 5%;
}

.content {
  max-width: map.get(v.$breakpoints, xl) * 1px;
  margin: 0 auto;
}

.nav-header {
  display: flex;
  padding-top: 42px; // Hardcode spacing to guarantee consistent space for logo

  @include m.spacing("pb", "lg");

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
      display: flex;
      position: relative;
      flex-direction: column;
      margin-left: auto;
      width: 260px;
      @include m.breakpoint("sm", "max") {
        width: 100%;
      }
      &__input {
        width: 100%;
      }
      &__logo {
        top: 0;
        right: 0;
        transform: translateY(-100%);
        position: absolute;
        align-self: flex-end;
        @include m.spacing("mr", "sm");
      }
    }
  }
}

.router-link-active {
  text-decoration: underline;
}
</style>

<style lang="scss">
.nuxt-loading-indicator {
  background-color: var(--theme-color-primary);
}
</style>
