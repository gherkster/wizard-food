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

/** The range over which to animate the header and mascot. */
const animationRangePx = "200px";
const contentPadding = "2rem";
const maxContentWidth = "1600px";

/**
 * Styles for the animated header.
 * On wider screen clients that support the animation-timeline API, this will animate compacting down when scrolling past,
 * and animate expanding back out when scrolling back to the top of the page.'
 */
const headerStyles = css({
  alignItems: "center",
  display: "flex",
  flexDirection: {
    base: "row",
    smDown: "column",
  },
  gap: "sm",
  paddingBlockStart: {
    // Reserve a constant padding block start to leave room for the mascot, leaving more space on larger screens
    base: "16px",
    md: "64px",
  },
  paddingBlockEnd: "xs",
  zIndex: 100,

  md: {
    backgroundColor: token("colors.body.background"),
    borderBottom: `2px solid ${token("colors.border")}`,

    "@supports (animation-timeline: view())": {
      animationName: "headerShrink", // Match the name of the animation defined in keyframes
      animationFillMode: "both",
      animationRange: "exit 0% exit 100%",
      animationTimeline: "--header-tracker", // Match the name of the parent timeline scope
      animationTimingFunction: "linear",
      padding: `calc((100% - ${maxContentWidth}) / 2)`,
      position: "sticky",
      top: 0,
      left: 0,
      right: 0,
    },
  },
});

/**
 * Styles for the animated mascot.
 * On wider screen clients that support the animation-timeline API, this will animate the mascot ducking down behind the search input when scrolling past,
 * and animate jumping back out when scrolling back to the top of the page.'
 */
const mascotStyles = css({
  alignSelf: "flex-end",
  marginRight: "sm",
  position: "absolute",
  right: 0,
  top: 0,
  translate: "auto",
  translateY: "-100%",
  md: {
    "@supports (animation-timeline: view())": {
      animationName: "mascotDuck", // Match the name of the animation defined in keyframes
      animationFillMode: "both",
      animationRange: "exit 0% exit 100%",
      animationTimeline: "--header-tracker", // Match the name of the parent timeline scope
      animationTimingFunction: "linear",
    },
  },
  zIndex: 5,
});
</script>

<template>
  <div
    :class="
      css({
        maxWidth: maxContentWidth,
        margin: '0 auto',
        padding: contentPadding,
        position: 'relative',
        timelineScope: '--header-tracker',
      })
    "
  >
    <div
      :class="
        css({
          position: 'absolute',
          top: 0,
          height: animationRangePx,
          width: '100%',
          pointerEvents: 'none',
          viewTimelineName: '--header-tracker',
          viewTimelineAxis: 'block',
        })
      "
    ></div>

    <NuxtLoadingIndicator :duration="1000" :throttle="500" :height="3" :color="false" />

    <header :class="headerStyles">
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
          <VMascot :animate="isAnimated" :size="54" :class="mascotStyles" />

          <VSearch
            :value="query"
            :class="
              css({
                width: '100%',
                zIndex: '50', // Ensure the search is in front of the mascot
              })
            "
            @input="onInput"
            @search="onInput"
          />
        </div>
      </div>
    </header>

    <div :class="css({ maxWidth: token('breakpoints.xl'), margin: '0 auto', marginTop: 'md' })">
      <slot />
    </div>
  </div>
</template>

<style>
.nuxt-loading-indicator {
  background-color: var(--colors-primary);
}
</style>
