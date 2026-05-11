import { defineRecipe } from "@pandacss/dev";

export const styleRecipes = {
  reveal: defineRecipe({
    className: "reveal",
    description: "Subtle fade and slide reveal for initializing states",
    base: {
      animationDuration: "token(durations.quickFade)",
      animationTimingFunction: "token(easings.quickFade)",
      animationFillMode: "forwards",
    },
    variants: {
      loading: {
        true: {
          opacity: 0,
          pointerEvents: "none",
        },
        false: {
          animationName: "revealIn",
          pointerEvents: "auto",
        },
      },
    },
    defaultVariants: {
      loading: false,
    },
  }),
};
