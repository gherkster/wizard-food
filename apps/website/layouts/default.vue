<script setup lang="ts">
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

import { useSearch } from "~/composables/useSearch";
import { debounce } from "~/utils/debounce";

const { activeQuery, createQuerySearchLink, init } = useSearch();
/*
  Kick off a background download of the search index if it hasn't been downloaded yet.
  Periodic checks are done after page load within the versioning middleware.
  This is also needed to pull in the data from localStorage on a fresh page load.
*/
init().catch((error) => {
  console.error(error);
});

const handleSearch = debounce(async (value: string) => {
  const trimmedQuery = value.trim();

  // If a search query already exists, replace history. If fresh search, push to history.
  const shouldReplace = !!activeQuery.value;

  await navigateTo(createQuerySearchLink(trimmedQuery, shouldReplace));
}, 200); // Debounce the search input, can be quite short since the searching is in-memory

const isAnimated = ref(false);

const animateMascot = () => {
  isAnimated.value = true;
  // Finish animation after a debounced delay
  finishAnimating();
};

const finishAnimating = debounce(() => {
  isAnimated.value = false;
}, 1000); // Debounce for the typing animation should be relatively long to reduce jumping

const onInput = (value: string) => {
  handleSearch(value);
  animateMascot();
};

/** The range over which to animate the header and mascot. */
const animationRangePx = "200px";
const maxContentWidth = "1600px";

/**
 * Styles for the animated header.
 * On wider screen clients that support the animation-timeline API, this will animate compacting down when scrolling past,
 * and animate expanding back out when scrolling back to the top of the page.'
 */
const headerStyles = css({
  display: "flex",
  flexDirection: "column",
  gap: "xs",
  paddingBlockStart: {
    // Reserve a constant padding block start to leave room for the mascot, leaving more space on larger screens
    base: "16px",
    md: "64px",
  },
  paddingBlockEnd: "xs",
  width: "100%",
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

const topRowCss = css({
  alignItems: "center",
  display: "flex",
  flexDirection: { base: "column", md: "row" },
  justifyContent: "space-between",
  position: "relative",
  py: 4,
  rowGap: "sm",
  width: "100%",
  zIndex: 20,
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
        padding: '1.2rem',
        position: 'relative',

        '@supports (animation-timeline: view())': {
          timelineScope: '--header-tracker',
        },
      })
    "
  >
    <div
      :class="
        css({
          position: 'absolute',
          top: 0,
          height: animationRangePx,
          left: 0,
          right: 0,
          pointerEvents: 'none',

          '@supports (animation-timeline: view())': {
            viewTimelineName: '--header-tracker',
            viewTimelineAxis: 'block',
          },
        })
      "
    ></div>

    <NuxtLoadingIndicator :duration="1000" :throttle="500" :height="3" :color="false" />

    <header :class="headerStyles">
      <nav :class="topRowCss">
        <NuxtLink to="/" style="color: unset">
          <Text size="xxxl" text-wrap="noWrap" weight="bold">Wizard Food</Text>
        </NuxtLink>

        <div
          :class="
            css({
              alignItems: 'center',
              columnGap: 'sm',
              display: 'flex',
              flexWrap: 'wrap',
              rowGap: 'md',
              mdDown: {
                width: '100%',
              },
            })
          "
        >
          <div
            :class="
              css({
                display: 'flex',
                position: 'relative',
                flexDirection: 'column',
                flex: {
                  base: 1,
                  md: 'inherit',
                },
                marginLeft: 'auto',
                width: {
                  base: '100%',
                  md: '260px',
                },
              })
            "
          >
            <VMascot :animate="isAnimated" :size="54" :class="mascotStyles" />

            <form
              :class="
                css({
                  display: 'flex',
                  flexBasis: {
                    base: undefined,
                    smDown: '100%',
                  },
                  width: '100%',
                  zIndex: '50', // Ensure the search is in front of the mascot
                })
              "
              role="search"
              @submit.prevent="$emit('search', activeQuery ?? '')"
            >
              <Input
                :model-value="activeQuery ?? ''"
                :class="css({ color: token('colors.font.muted'), flexBasis: '100%' })"
                clearable
                icon-left="mynaui:search"
                placeholder="Search recipes..."
                @update:model-value="onInput"
              />
            </form>
          </div>
        </div>
      </nav>
    </header>

    <div :class="css({ maxWidth: token('breakpoints.xl'), margin: '2em auto' })">
      <slot />
    </div>
  </div>
</template>

<style>
.nuxt-loading-indicator {
  background-color: var(--colors-primary);
}
</style>
