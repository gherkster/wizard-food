import { fileURLToPath } from "node:url";

import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";

const workspaceRoot = fileURLToPath(new URL("../../", import.meta.url));
const srcDir = fileURLToPath(new URL("./src", import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  vite: {
    resolve: {
      alias: {
        "@": srcDir,
      },
    },
    server: {
      fs: {
        allow: [workspaceRoot],
      },
    },
  },
});
