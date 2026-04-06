import { fileURLToPath } from "node:url";
import path from "node:path";
import * as fs from "node:fs/promises";
import * as crypto from "node:crypto";

import MiniSearch from "minisearch";
import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { loadAllRecipes } from "@wizard/content/store";
import type { RecipePreview } from "@wizard/content/store";

import {
  type SearchIndexRecipe,
  type SearchIndexSearchFields,
  searchIndexSettings,
} from "../utils/search";
import type { AppVersion } from "../types/version";

const CF_BUILD_ID_ENV = "CF_PAGES_COMMIT_SHA";

export const recipeSearchIndexIntegration = (): AstroIntegration => ({
  name: "wizard-recipe-search-index",
  hooks: {
    async "astro:config:setup"({ command, config, logger }) {
      if (command !== "dev" && command !== "build") {
        return;
      }

      const buildId = resolveBuildId(command);
      const outputDir = fileURLToPath(config.publicDir);

      await writeSearchArtifacts({ outputDir, buildId, logger, reason: command });
    },
    async "astro:build:done"({ dir, logger }) {
      const buildId = resolveBuildId("build");
      const outputDir = fileURLToPath(dir);

      await writeSearchArtifacts({ outputDir, buildId, logger, reason: "build:done" });
    },
  },
});

const resolveBuildId = (command: "dev" | "build") => {
  const buildId = process.env[CF_BUILD_ID_ENV];

  if (command === "build" && process.env.CI && !buildId) {
    throw new Error(
      `${CF_BUILD_ID_ENV} environment variable is undefined. A build ID cannot be determined.`,
    );
  }

  return buildId ?? "local";
};

const generateRecipeSearchIndex = (recipes: SearchIndexRecipe[]) => {
  const miniSearch = new MiniSearch<SearchIndexSearchFields>(searchIndexSettings);
  miniSearch.addAll(recipes);
  return JSON.stringify(miniSearch);
};

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

const loadRecipesForIndex = async (): Promise<SearchIndexRecipe[]> => {
  const recipes = await loadAllRecipes(".content");
  return recipes.map((recipe) => mapToSearchIndexRecipe(recipe));
};

const getVersionJson = (indexJson: string, buildId: string): string => {
  const searchIndexHash = crypto.createHash("md5").update(indexJson).digest("hex");

  const version: AppVersion = {
    build: buildId,
    searchIndex: searchIndexHash,
  };

  return JSON.stringify(version);
};

const writeSearchArtifacts = async ({
  outputDir,
  buildId,
  logger,
  reason,
}: {
  outputDir: string;
  buildId: string;
  logger: AstroIntegrationLogger;
  reason: string;
}) => {
  const recipes = await loadRecipesForIndex();
  const indexJson = generateRecipeSearchIndex(recipes);
  const versionJson = getVersionJson(indexJson, buildId);

  await fs.mkdir(outputDir, { recursive: true });
  const searchIndexPath = path.join(outputDir, "search-index.json");
  const versionPath = path.join(outputDir, "version.json");

  await fs.writeFile(searchIndexPath, indexJson, "utf8");
  await fs.writeFile(versionPath, versionJson, "utf8");

  logger.info(`Generated recipe search artifacts (${reason}) at ${outputDir}`);
};
