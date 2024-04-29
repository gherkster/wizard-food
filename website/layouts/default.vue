<template>
  <div>
    <header class="nav-header">
      <div class="nav-header__links">
        <nuxt-link to="/">Home</nuxt-link>
        <nuxt-link to="/recipes">Recipes</nuxt-link>
      </div>
      <div class="nav-header__search">
        <v-input v-model="query" placeholder="Search" @update:model-value="search" @keydown.prevent.enter="search" />
      </div>
    </header>
    <div class="page">
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

async function search() {
  const trimmedQuery = query.value.trim();
  if (trimmedQuery.length === 0) {
    await navigateTo("/recipes");
  }

  if (trimmedQuery.length < 4) {
    // TODO: Indicate minimum length
    return;
  }
  await navigateTo({
    path: "/recipes",
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
