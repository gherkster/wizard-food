import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

import { getPrerenderPages } from "./scripts/prerender-pages";

const config = defineConfig(async () => {
  const pages = await getPrerenderPages();

  return {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      devtools(),
      tailwindcss(),
      tanstackStart({
        prerender: {
          enabled: true,
          crawlLinks: false,
          autoStaticPathsDiscovery: false,
          autoSubfolderIndex: false,
          failOnError: true,
        },
        pages: pages,
      }),
      viteReact(),
      // Keep visualizer last as per docs
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
  };
});

export default config;
