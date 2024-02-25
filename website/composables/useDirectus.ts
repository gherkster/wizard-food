import { createDirectus, readItems, rest, RestClient } from "@directus/sdk";
import { ServerRecipe } from "common/types/serverRecipe";
import { GlobalSettings } from "common/types/global";

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
  "instructionGroups.instructions.text",
  "instructionGroups.instructions.image.id",
  ...getImageFields("instructionGroups.instructions.image"),
];

export function useDirectus() {
  const url = process.env.NUXT_BASE_URL;
  if (!url) {
    throw new Error("Directus endpoint environment variable missing");
  }
  const clientId = process.env.NUXT_CF_ACCESS_CLIENT_ID;
  if (!clientId) {
    throw new Error("Cloudflare client ID environment variable missing");
  }
  const clientSecret = process.env.NUXT_CF_ACCESS_CLIENT_SECRET;
  if (!clientSecret) {
    throw new Error("Cloudflare client secret environment variable missing");
  }

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
          slug: {
            _eq: slug,
          },
        },
        fields: searchFields,
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

  async function getRelatedRecipes(slug: string) {
    return [
      {
        title: slug,
        coverImage: null,
      },
    ];
  }
  return {
    client,
    getRecipe,
    getAllRecipes,
    getRelatedRecipes,
  };
}
