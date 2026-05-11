import { defineKeyframes } from "@pandacss/dev";

export const keyframes = defineKeyframes({
  /** Keyframes to have the header shrink when scrolling down the page on clients that support the animation-timeline API. */
  headerShrink: {
    "0%": { paddingBlock: "64px {spacing.xs}" },
    "100%": { paddingBlock: "{spacing.xs}" },
  },
  /** Keyframes to have the mascot duck behind the search bar when scrolling down the page on clients that support the animation-timeline API. */
  mascotDuck: {
    "0%": { transform: "translateY(0%)", opacity: 1 },
    "100%": { transform: "translateY(70%)", opacity: 0 },
  },
  revealIn: {
    "0%": { opacity: 0, transform: "translateY(2px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
});
