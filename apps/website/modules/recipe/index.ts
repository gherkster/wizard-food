import { loadAllRecipes } from "@wizard/content";
import { defineNuxtModule, useLogger } from "nuxt/kit";
import type { Nuxt } from "nuxt/schema";

const logger = useLogger();

// https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
const commitHashVariableName = "WORKERS_CI_COMMIT_SHA";

export default defineNuxtModule({
  async setup(_, nuxt) {
    nuxt.options.appConfig.externalBaseUrl = process.env.PUBLIC_SITE_URL ?? "";

    nuxt.hook("prerender:routes", async ({ routes }) => {
      const contentDir = getContentDirectory(nuxt);

      const recipes = await loadAllRecipes(contentDir);

      if (recipes.length === 0) {
        throw new Error("No recipes retrieved.");
      }

      const recipeRoutes = recipes.map((recipe) => `/recipes/${recipe.slug}`);
      recipeRoutes.forEach((s) => routes.add(s));

      logger.info(`Added ${recipeRoutes.length} routes to prerender`);
    });
  },
});

const getContentDirectory = (nuxt: Nuxt) => {
  const contentDir = `${nuxt.options.rootDir}/.content`;

  if (process.env.CI && !process.env[commitHashVariableName]) {
    throw new Error(
      `${commitHashVariableName} environment variable is undefined. A build ID cannot be determined.`,
    );
  }

  return contentDir;
};
