import { createDirectus, readItems, readSingleton, rest } from "@directus/sdk";
import type { QueryFields, RestClient } from "@directus/sdk";
import type { ServerRecipe, ServerRecipePreview } from "common/types/serverRecipe";
import type { PageContent } from "common/types/content";
import type { ServerIngredientUnitForm } from "common/types/serverMapping";

type CmsSchema = {
  recipes: ServerRecipe[];
  home_page: PageContent;
  recipes_page: PageContent;
  ingredient_unit_forms: ServerIngredientUnitForm[];
};

const getImageFields = (path: string): QueryFields<CmsSchema, ServerRecipe> => [
  `${path}.id`,
  `${path}.width`,
  `${path}.height`,
  `${path}.title`,
  `${path}.modified_on`,
];

const searchFields: QueryFields<CmsSchema, ServerRecipe> = [
  "*",
  ...getImageFields("coverImage"),
  "ingredientGroups.name",
  "ingredientGroups.ingredients.*",
  "instructionGroups.name",
  "instructionGroups.instructions.id",
  "instructionGroups.instructions.text",
  "instructionGroups.instructions.image.id",
  // Gets the inline_ingredient relationships from the instruction to the specified ingredient
  "instructionGroups.instructions.inline_ingredients.*",
  "instructionGroups.instructions.inline_ingredients.ingredient_id.*",
  ...getImageFields("instructionGroups.instructions.image"),
];

export function useDirectus({ url, clientId, clientSecret }: { url: string; clientId: string; clientSecret: string }) {
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("CF-Access-Client-Id", clientId);
  requestHeaders.set("CF-Access-Client-Secret", clientSecret);

  const client = createDirectus<CmsSchema>(url).with<RestClient<CmsSchema>>(
    rest({
      onRequest: () => {
        return {
          headers: requestHeaders,
        };
      },
    }),
  );

  async function getRecipe(slug: string) {
    const recipes = await client.request<ServerRecipe[]>(
      readItems("recipes", {
        filter: {
          status: {
            _eq: "published",
          },
          slug: {
            _eq: slug,
          },
        },
        fields: searchFields,
        limit: 1,
      }),
    );

    return recipes.length === 0 ? recipes[0] : null;
  }

  // TODO: Only get back required fields
  async function getAllRecipes() {
    return await client.request<ServerRecipePreview[]>(
      readItems("recipes", {
        fields: ["*", ...getImageFields("coverImage")],
        filter: {
          status: {
            _eq: "published",
          },
        },
        sort: "-date_created",
      }),
    );
  }

  async function getHomePageContent() {
    return await client.request<PageContent>(readSingleton("home_page"));
  }

  async function getRecipesPageContent() {
    return await client.request<PageContent>(readSingleton("recipes_page"));
  }

  async function getIngredientUnitSingularPluralMapping() {
    return await client.request<ServerIngredientUnitForm[]>(readItems("ingredient_unit_forms"));
  }

  return {
    client,
    getRecipe,
    getAllRecipes,
    getHomePageContent,
    getRecipesPageContent,
    getIngredientUnitSingularPluralMapping,
  };
}
