import { defineConfig } from "@pandacss/dev";

import { globalFont, globalStyles } from "./styles/globalStyles";
import { keyframes } from "./styles/keyframes";
import { palette } from "./styles/palette";

const clamp = (minSize: number, maxSize: number, minVw = 320, maxVw = 1400) => {
  return `clamp(${minSize}px, calc(${minSize}px + (${maxSize} - ${minSize}) * ((100vw - ${minVw}px) / (${maxVw} - ${minVw}))), ${maxSize}px)`;
};

export default defineConfig({
  exclude: [],

  globalCss: globalStyles,

  // Where to look for css declarations
  include: [
    "./app.vue",
    "./error.vue",
    "./components/**/*.{js,jsx,ts,tsx,vue}",
    "./layouts/**/*.{js,jsx,ts,tsx,vue}",
    "./pages/**/*.{js,jsx,ts,tsx,vue}",
  ],

  importMap: "styled-system",

  // The output directory for your css system
  outdir: "styled-system",

  // Whether to use css reset
  preflight: true,

  theme: {
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    keyframes: keyframes,
    tokens: {
      colors: palette,
      fonts: {
        headers: { value: globalFont.family },
        paragraph: { value: globalFont.family },
      },
      fontWeights: {
        regular: { value: globalFont.weights.regular },
        bold: { value: globalFont.weights.bold },
      },
      fontSizes: {
        xxl: { value: clamp(26, 36) },
        xl: { value: clamp(20, 26) },
        lg: { value: clamp(16, 20) },
        md: { value: clamp(14, 16) }, // html, input, button
        sm: { value: clamp(12, 14) },
      },
      spacing: {
        lg: { value: clamp(32, 64) },
        md: { value: clamp(24, 48) },
        sm: { value: clamp(18, 24) },
        xs: { value: clamp(8, 16) },
        xxs: { value: clamp(4, 8) },

        // Semantic spacings
        "cols-gap": { value: "24px" },
        "cols-gap-wide": { value: "80px" },
        "li-mb": { value: "16px" },
        "header-mb": { value: "16px" },
        "p-my": { value: "16px" },
      },
      radii: {
        sm: { value: "6px" },
        md: { value: "10px" },
      },
      sizes: {
        "btn-min": { value: "84px" },
        "preview-max": { value: "260px" },
        "preview-min": { value: "120px" },
      },
    },
    semanticTokens: {
      colors: {
        primary: { value: { base: palette.marmalade.value, _osDark: palette.rockmelon.value } },
        body: {
          background: { value: { base: palette.whey.value, _osDark: palette.espresso.value } },
        },
        border: {
          value: {
            base: palette.chai.value,
            _osDark: palette.clove.value,
          },
        },
        font: {
          DEFAULT: {
            value: {
              base: palette.poppySeed.value,
              _osDark: palette.bone.value,
            },
          },
          muted: { value: { base: palette.rye.value, _osDark: palette.ash.value } },
        },
        link: { value: { base: palette.burntHoney.value, _osDark: palette.rockmelon.value } },
        surface: {
          value: {
            base: palette.frosting.value,
            _osDark: palette.molasses.value,
          },
        },
      },
      borders: {
        primary: { value: "2px solid {colors.primary}" },
      },
    },
  },
});
