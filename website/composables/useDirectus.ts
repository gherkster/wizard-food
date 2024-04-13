import { createDirectus, readItems, rest } from "@directus/sdk";
import type { RestClient } from "@directus/sdk";
import type { ServerRecipe } from "common/types/serverRecipe";
import type { GlobalSettings } from "common/types/global";

export interface CmsSchema {
  global: GlobalSettings[];
  recipes: ServerRecipe[];
}

const getImageFields = (path: string) => [
  `${path}.id`,
  `${path}.name`,
  `${path}.width`,
  `${path}.height`,
  `${path}.title`,
  `${path}.modified_on`,
];

const searchFields = [
  "*",
  "tags.tags_id.value",
  "coverImage.id",
  "coverImage.name",
  "coverImage.width",
  "coverImage.height",
  "coverImage.filename_disk",
  "coverImage.modified_on",
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

    return recipes.length > 0 ? recipes[0] : null;
  }

  async function getAllRecipes() {
    return await client.request<ServerRecipe[]>(
      readItems("recipes", {
        fields: searchFields,
        filter: {
          status: {
            _eq: "published",
          },
        },
      }),
    );
  }

  return {
    client,
    getRecipe,
    getAllRecipes,
  };
}
