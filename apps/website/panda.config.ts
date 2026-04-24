import { defineConfig } from "@pandacss/dev";

import { globalFont, globalStyles } from "./styles/globalStyles";

const clamp = (minSize: number, maxSize: number, minVw = 320, maxVw = 1400) => {
  return `clamp(${minSize}px, calc(${minSize}px + (${maxSize} - ${minSize}) * ((100vw - ${minVw}px) / (${maxVw} - ${minVw}))), ${maxSize}px)`;
};

export default defineConfig({
  // Files to exclude
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

  // The output directory for your css system
  outdir: "styled-system",

  // Whether to use css reset
  preflight: true,

  theme: {
    extend: {
      breakpoints: {
        xs: "320px",
        sm: "480px",
        md: "720px",
        lg: "992px",
        xl: "1400px",
      },
      tokens: {
        fonts: {
          headers: { value: globalFont.family },
          paragraph: { value: globalFont.family },
        },
        fontWeights: {
          regular: { value: globalFont.weights.regular },
          bold: { value: globalFont.weights.bold },
        },
        fontSizes: {
          base: { value: clamp(16, 18) }, // html, input, button
          h1: { value: clamp(30, 48) },
          h2: { value: clamp(26, 36) },
          h3: { value: clamp(20, 26) },
          h4: { value: clamp(16, 20) },
          h5: { value: clamp(16, 20) },
          h6: { value: clamp(16, 20) },
          small: { value: clamp(14, 15) },
        },
        spacing: {
          lg: { value: clamp(32, 96) },
          md: { value: clamp(24, 48) },
          sm: { value: clamp(18, 32) },
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
          // base = Light Mode, _osDark = OS level Dark Mode (prefers-color-scheme)
          primary: { value: { base: "#cc7a3b", _osDark: "#db9250" } },
          active: { value: { base: "#ad632a", _osDark: "#bc783c" } },
          body: {
            background: { value: { base: "#f9f5ed", _osDark: "#261f1a" } },
            accent: { value: { base: "#f7e3ce", _osDark: "#604838" } },
            overlay: { value: { base: "#fffcf5", _osDark: "#705545" } },
          },
          font: {
            DEFAULT: { value: { base: "#3a3a3a", _osDark: "#f5f5f5" } },
            muted: { value: { base: "#707070", _osDark: "#a8a8a8" } },
          },
          inputBackground: { value: { base: "#ffffff", _osDark: "#3a2f28" } },
          link: { value: { base: "#9e5620", _osDark: "#eda76a" } },
        },
        borders: {
          primary: { value: "2px solid {colors.primary}" },
        },
      },
    },
  },
});
