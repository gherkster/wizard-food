module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier", "@vue/typescript/recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "max-len": ["warn", { code: 120 }],
    "vue/multi-word-component-names": "off",
  },
  ignorePatterns: ["dist"],
};
