import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { devtools } from "@tanstack/devtools-vite";
import tailwindcss from "@tailwindcss/vite";

import { getPrerenderPages } from "./scripts/prerender-pages";

const config = defineConfig(async () => {
  const pages = await getPrerenderPages();

  return {
    plugins: [
      devtools(),
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      tanstackStart({
        prerender: {
          enabled: true,
          crawlLinks: false,
          autoStaticPathsDiscovery: false,
          autoSubfolderIndex: false,
        },
        pages,
      }),
      viteReact(),
    ],
  };
});

export default config;
