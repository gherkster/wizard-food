import type { IncomingMessage, ServerResponse } from "node:http";
import * as fs from "node:fs/promises";
import * as crypto from "node:crypto";

import type { Plugin as VitePlugin } from "vite";
import type { Nuxt } from "nuxt/schema";
import { addTemplate, addVitePlugin, defineNuxtModule, useLogger } from "nuxt/kit";
import MiniSearch from "minisearch";
import type { RecipePreview } from "@wizard/content/store";
import {
  getAllRecipes,
  getFeaturedRecipes,
  getPageContent,
  getRecipeBySlug,
  loadRecipesBySlug,
} from "@wizard/content/store";

import {
  type SearchIndexRecipe,
  type SearchIndexSearchFields,
  searchIndexSettings,
} from "../../utils/search";

const logger = useLogger();

export default defineNuxtModule({
  async setup(_, nuxt) {
    const buildId = process.env.CF_PAGES_COMMIT_SHA ?? "local";
    const contentDir = `${nuxt.options.rootDir}/.content`;

    if (nuxt.options.dev === false && !process.env.CF_PAGES_COMMIT_SHA) {
      throw new Error(
        "CF_PAGES_COMMIT_SHA environment variable is undefined. A build ID cannot be determined.",
      );
    }

    nuxt.options.appConfig.externalBaseUrl = process.env.NUXT_PUBLIC_SITE_URL ?? "";

    await createContentTemplate(nuxt, contentDir);

    addVitePlugin(createViteDevContentApiPlugin(contentDir));

    const recipes = await loadAllRecipesForModule(contentDir);

    nuxt.hook("prerender:routes", async ({ routes }) => {
      const recipeRoutes = recipes.map((recipe) => `/recipes/${recipe.slug}`);
      recipeRoutes.forEach((s) => routes.add(s));

      logger.info(`Added ${recipeRoutes.length} routes to prerender`);

      const searchIndex = generateRecipeSearchIndex(recipes.map((r) => mapToSearchIndexRecipe(r)));
      await saveRecipeSearchIndex(searchIndex, nuxt, buildId);
    });

    if (process.env.NODE_ENV === "development") {
      logger.info("Refreshing search index for local development");

      const searchIndex = generateRecipeSearchIndex(recipes.map((r) => mapToSearchIndexRecipe(r)));
      await saveRecipeSearchIndex(searchIndex, nuxt, buildId);
    }
  },
});

const createContentTemplate = async (nuxt: Nuxt, contentDir: string) => {
  const recipesBySlug = await loadRecipesBySlugForModule(contentDir);
  const featuredRecipes = await loadFeaturedRecipesForModule(contentDir);
  const homePageContent = await loadPageContentForModule("home", contentDir);
  const recipesPageContent = await loadPageContentForModule("recipes", contentDir);

  const template = addTemplate({
    filename: "module/content-data.mjs",
    getContents: () =>
      [
        `export const recipesBySlug = ${JSON.stringify(recipesBySlug)};`,
        `export const featuredRecipes = ${JSON.stringify(featuredRecipes)};`,
        `export const homePageContent = ${JSON.stringify(homePageContent)};`,
        `export const recipesPageContent = ${JSON.stringify(recipesPageContent)};`,
      ].join("\n"),
  });

  nuxt.options.alias["#content"] = template.dst;
};

const createViteDevContentApiPlugin = (contentDir: string): VitePlugin => {
  return {
    name: "wizard-content-dev-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) {
          next();
          return;
        }

        try {
          const pathname = new URL(req.url, "http://localhost").pathname;

          if (pathname === "/api/featured-recipes") {
            const featured = await getFeaturedRecipes(contentDir);
            sendJson(res, 200, featured);
            return;
          }

          if (pathname === "/api/content/home") {
            const content = await getPageContent("home", contentDir);
            sendJson(res, 200, content);
            return;
          }

          if (pathname === "/api/content/recipes") {
            const content = await getPageContent("recipes", contentDir);
            sendJson(res, 200, content);
            return;
          }

          const matchRecipe = pathname.match(/^\/api\/recipes\/(.+)$/);
          if (matchRecipe) {
            const slugComponent = matchRecipe[1];
            if (!slugComponent) {
              throw new Error("Slug is a required path parameter.");
            }

            const slug = decodeURIComponent(slugComponent);
            const recipe = await getRecipeBySlug(slug, contentDir);

            if (!recipe) {
              sendJson(res, 404, {
                statusCode: 404,
                statusMessage: "Recipe not found",
              });
              return;
            }

            sendJson(res, 200, recipe);
            return;
          }

          next();
        } catch (error) {
          sendJson(res, 500, {
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "Unexpected content error",
          });
        }
      });
    },
  };
};

const loadAllRecipesForModule = async (contentDir: string) => {
  return await getAllRecipes(contentDir);
};

const loadRecipesBySlugForModule = async (contentDir: string) => {
  return await loadRecipesBySlug(contentDir);
};

const loadFeaturedRecipesForModule = async (contentDir: string) => {
  return await getFeaturedRecipes(contentDir);
};

const loadPageContentForModule = async (page: "home" | "recipes", contentDir: string) => {
  return await getPageContent(page, contentDir);
};

const sendJson = (res: ServerResponse<IncomingMessage>, statusCode: number, body: unknown) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

const generateRecipeSearchIndex = (recipes: SearchIndexRecipe[]) => {
  logger.info("Generating recipe search index");
  const miniSearch = new MiniSearch<SearchIndexSearchFields>(searchIndexSettings);

  miniSearch.addAll(recipes);
  return JSON.stringify(miniSearch);
};

async function saveRecipeSearchIndex(index: string, nuxt: Nuxt, buildId: string) {
  const publicFolderPath = `${nuxt.options.rootDir}/public`;
  await fs.mkdir(publicFolderPath, { recursive: true });
  await fs.writeFile(`${publicFolderPath}/search-index.json`, index, "utf8");

  const hash = crypto.createHash("md5").update(index).digest("hex");
  logger.info("Generated search index hash:", hash);

  const currentVersion = {
    build: buildId,
    searchIndex: hash,
  };

  const versionJson = JSON.stringify(currentVersion);
  await fs.writeFile(`${publicFolderPath}/version.json`, versionJson, "utf8");
  logger.info("Generated version.json", versionJson);
}

const mapToSearchIndexRecipe = (recipe: RecipePreview): SearchIndexRecipe => {
  return {
    title: recipe.title,
    coverImage: {
      height: recipe.coverImage.height,
      width: recipe.coverImage.width,
      previewSquare: recipe.coverImage.variants.preview.square,
    },
    totalDurationLabel: recipe.totalDurationLabel,
    tags: recipe.tags,
    featuredTag: recipe.featuredTag,
    slug: recipe.slug,
  };
};
