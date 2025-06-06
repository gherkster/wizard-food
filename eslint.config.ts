import pluginVue from "eslint-plugin-vue";
import typescriptEslint from "typescript-eslint";
import eslintConfigPrettier from 'eslint-config-prettier';

export default typescriptEslint.config(
  {
    extends: [
      ...typescriptEslint.configs.recommended,
      ...pluginVue.configs["flat/recommended"],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    ignores: ["dist", "directus-schema.*"],
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/html-self-closing": "off",
      "vue/no-v-html": "off",
    }
  },
  eslintConfigPrettier
);
