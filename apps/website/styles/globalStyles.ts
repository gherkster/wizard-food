import { defineGlobalStyles } from "@pandacss/dev";

// This font variable is used below directly to set the font family, instead of via a theme token.
// This is because nuxt-fonts will only pick up font-family declarations defined with a value in the output css, not ones referencing a css variable.
// The font family panda theme token is set to this value as well for consistency.
export const globalFont = {
  family: '"Plus Jakarta Sans", sans-serif',
  weights: {
    regular: 400,
    bold: 600,
  },
} as const;

export const globalStyles = defineGlobalStyles({
  "html, body": {
    height: "100%",
  },
  html: {
    bg: "body.background",
    fontSize: "md",
  },
  body: {
    color: "font",
    fontFamily: globalFont.family,
    textUnderlineOffset: "3px",
  },
  "body, input, button": {
    color: "font",
    fontFamily: globalFont.family,
  },
  "input, textarea, button, select, a": {
    WebkitTapHighlightColor: "transparent", // Disable the blue rectangle button highlight on webkit mobile
  },
  input: {
    color: "font",
    fontSize: "md",
    lineHeight: "1.2",
  },
  button: {
    fontSize: "md",
    cursor: "pointer",
  },
  img: {
    fontSize: "0", // Hide alt text while loading
    width: "100%",
    height: "auto",
  },
  "h1, h2, h3, h4, h5, h6": {
    fontFamily: globalFont.family,
    fontWeight: globalFont.weights.regular,
    lineHeight: "1.2",
    margin: "0 0 {spacing.header-mb} 0",
  },
  h1: { fontSize: "xxxl" },
  h2: { fontSize: "xxl" },
  h3: { fontSize: "xl" },
  h4: { fontSize: "lg" },
  h5: { fontSize: "md" },
  h6: { fontSize: "sm" },
  p: {
    lineHeight: 1.5,
    marginBottom: "1em",
    "&:last-of-type": {
      marginBottom: 0,
    },
  },
  span: {
    lineHeight: 1.5,
  },
  b: {
    fontWeight: globalFont.weights.bold,
  },
  small: {
    fontSize: "small",
    marginTop: 0,
  },
  ul: {
    margin: 0,
  },
  "li:not(:last-child)": {
    marginBottom: "12px",
  },
  a: {
    color: "link",
  },
  ".rich-text": {
    marginTop: 0,
    "& a": {
      textDecoration: "underline",
    },
  },
  "::selection": {
    bg: "selection",
  },
});
