<script setup lang="ts">
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

import { useSearch } from "~/composables/useSearch";
import { debounce } from "~/utils/debounce";

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

const onInput = (value: string) => {
  search(value);
  animateMascot();
};

/** Debounce value for the search input, can be quite short since it is in-memory */
const searchDebounceMs = 150;

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
}, searchDebounceMs);

const isAnimated = ref(false);

const animateMascot = () => {
  isAnimated.value = true;
  // Finish animation after a debounced delay
  finishAnimating();
};

/** Debounce value for the typing animation, should be longer to reduce jumping */
const animationDebounceMs = 1000;

const finishAnimating = debounce(() => {
  isAnimated.value = false;
}, animationDebounceMs);
</script>

<template>
  <div :class="css({ maxWidth: '1600px', margin: '0 auto', padding: '2rem 4%' })">
    <NuxtLoadingIndicator :duration="1000" :throttle="500" :height="3" :color="false" />

    <header
      :class="
        css({
          alignItems: 'center',
          display: 'flex',
          flexDirection: {
            base: 'row',
            smDown: 'column',
          },
          gap: 'sm',
          paddingTop: {
            base: '32px', // Hardcode spacing to guarantee consistent space for logo,
            smDown: 'sm',
          },
          paddingBottom: 'lg',
        })
      "
    >
      <NuxtLink to="/" style="color: unset">
        <Text size="xxl" text-wrap="noWrap" weight="bold">Wizard Food</Text>
      </NuxtLink>

      <div
        :class="
          css({
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            width: '100%',
            columnGap: 'sm',
            rowGap: 'md',
          })
        "
      >
        <div
          :class="
            css({
              display: 'flex',
              position: 'relative',
              flexDirection: 'column',
              marginLeft: 'auto',
              width: {
                base: '260px',
                smDown: '100%',
              },
            })
          "
        >
          <VMascot
            :animate="isAnimated"
            :size="54"
            :class="
              css({
                alignSelf: 'flex-end',
                marginRight: 'sm',
                position: 'absolute',
                right: 0,
                top: 0,
                translate: 'auto',
                translateY: '-100%',
              })
            "
          />

          <VSearch
            :value="query"
            :class="css({ width: '100%' })"
            @input="onInput"
            @search="onInput"
          />
        </div>
      </div>
    </header>

    <div :class="css({ maxWidth: token('breakpoints.xl'), margin: '0 auto' })">
      <slot />
    </div>
  </div>
</template>

<style>
.nuxt-loading-indicator {
  background-color: var(--colors-primary);
}
</style>
