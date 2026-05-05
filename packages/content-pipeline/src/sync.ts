import path from "node:path";

import type { WebsitePagesContent } from "@wizard/content";
import type { IngredientUnitForms, ServerRecipe } from "@wizard/openapi";

import { buildFeaturedRecipes } from "./build/featured";
import { useDirectusApi } from "./directus/client";
import type { DirectusRuntimeConfig } from "./directus/client";
import { mapToRecipe } from "./map/directusRecipeMapper";
import { writeContentArtifacts } from "./output/writeArtifacts";
import { mapToRecipePreview } from "./utils/mapping";

export const resolveContentOutputDir = (contentDir?: string) => {
  return path.resolve(
    contentDir ?? process.env.CONTENT_DIR ?? path.join(process.cwd(), ".content"),
  );
};

export type SyncContentOptions = {
  directus: DirectusRuntimeConfig;
  outputDir?: string;
  buildId?: string;
};

export const syncContent = async (options: SyncContentOptions) => {
  const outputDir = resolveContentOutputDir(options.outputDir);
  const buildId = options.buildId ?? process.env.WORKERS_CI_COMMIT_SHA ?? "local";

  const client = useDirectusApi(options.directus);

  const { data: recipesResponse, error: getRecipesError } = await client.getRecipes();

  if (getRecipesError) {
    throw getRecipesError;
  }

  if (!recipesResponse || recipesResponse.length === 0) {
    throw new Error("No recipes returned from Directus");
  }

  const { data: unitForms, error: getUnitFormsError } = await client.getIngredientUnitForms();

  if (getUnitFormsError) {
    throw getUnitFormsError;
  }

  if (!unitForms || unitForms.length === 0) {
    throw new Error("No ingredient unit forms returned from Directus");
  }

  const { data: homeResponse, error: homeError } = await client.getHomePageContent();
  if (homeError || !homeResponse?.data) {
    throw homeError ?? new Error("No home page content returned from Directus");
  }

  const { data: recipesPageResponse, error: recipesPageError } =
    await client.getRecipesPageContent();
  if (recipesPageError || !recipesPageResponse?.data) {
    throw recipesPageError ?? new Error("No recipes page content returned from Directus");
  }

  const unitSingularPluralMap = new Map<string, IngredientUnitForms>();
  unitForms.forEach((uf) => {
    unitSingularPluralMap.set(mapKey(uf.singular_form), uf);
    unitSingularPluralMap.set(mapKey(uf.plural_form), uf);
  });

  const recipes = recipesResponse.map((recipe) =>
    mapToRecipe(recipe, {
      getUnitNames: (unit) => {
        return getSingularPluralMapping(unit, unitSingularPluralMap, recipe);
      },
    }),
  );

  const recipesBySlug = Object.fromEntries(recipes.map((recipe) => [recipe.slug, recipe]));
  const recipePreviews = recipes.map(mapToRecipePreview);
  const featuredRecipes = buildFeaturedRecipes(recipes);

  const pagesContent: WebsitePagesContent = {
    home: {
      title: homeResponse.data.title ?? "",
      description: homeResponse.data.description ?? "",
      openGraphDescription: homeResponse.data.openGraphDescription ?? "",
    },
    recipes: {
      title: recipesPageResponse.data.title ?? "",
      description: recipesPageResponse.data.description ?? "",
      openGraphDescription: recipesPageResponse.data.openGraphDescription ?? "",
    },
  };

  await writeContentArtifacts(
    [
      {
        filename: "recipes.by-slug.json",
        content: recipesBySlug,
      },
      {
        filename: "recipes.all.json",
        content: recipePreviews,
      },
      {
        filename: "featured-recipes.json",
        content: featuredRecipes,
      },
      {
        filename: "pages-content.json",
        content: pagesContent,
      },
      {
        filename: "meta.json",
        content: {
          build: buildId,
          generatedAt: new Date().toISOString(),
        },
      },
    ],
    {
      outputDir,
    },
  );
};

const getSingularPluralMapping = (
  unit: string,
  unitSingularPluralMap: Map<string, IngredientUnitForms>,
  recipe: ServerRecipe,
) => {
  const singularPluralPair = unitSingularPluralMap.get(mapKey(unit));

  if (!singularPluralPair) {
    console.warn(
      `No ingredient unit mapping found for ${unit} in recipe ${recipe.id} - ${recipe.title}`,
    );
    return {
      singular: unit,
      plural: unit,
    };
  }

  return {
    singular: singularPluralPair.singular_form,
    plural: singularPluralPair.plural_form,
  };
};

const mapKey = (unit: string) => {
  return unit.toUpperCase();
};
