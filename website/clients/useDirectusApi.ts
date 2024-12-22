import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "../../common/types/directus-schema";
import { useMapper } from "~/composables";

const client = createClient<paths>({ baseUrl: process.env.NUXT_BASE_URL ?? useRuntimeConfig().baseUrl });

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    request.headers.set(
      "CF-Access-Client-Id",
      process.env.NUXT_CF_ACCESS_CLIENT_ID ?? useRuntimeConfig().cfAccessClientId,
    );
    request.headers.set(
      "CF-Access-Client-Secret",
      process.env.NUXT_CF_ACCESS_CLIENT_SECRET ?? useRuntimeConfig().cfAccessClientSecret,
    );

    return request;
  },
};

client.use(authMiddleware);

const getImageFields = (path: string) => [
  `${path}.id`,
  `${path}.width`,
  `${path}.height`,
  `${path}.title`,
  `${path}.modified_on`,
];

const searchFields = [
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

export const useDirectusApi = () => {
  return {
    getRecipes: async () => {
      const { data, error } = await client.GET("/items/recipes", {
        params: {
          query: {
            fields: searchFields,
            filter: `{"status":{"_eq":"published"}}`,
            sort: ["-date_created"],
          },
        },
        querySerializer: {
          // Don't percent encode query parameters, as directus won't accept them
          allowReserved: true,
        },
      });

      if (error) {
        return { error };
      }

      const mapper = useMapper();
      return { data: data.data?.map((r) => mapper.toRecipePreview(r)) };
    },
    getRecipe: async (slug: string) => {
      const { data, error } = await client.GET("/items/recipes", {
        params: {
          query: {
            fields: searchFields,
            filter: `{"status":{"_eq":"published"}, "slug":{"_eq":"${slug}"}}`,
            limit: 1,
          },
        },
        querySerializer: {
          // Don't percent encode query parameters, as directus won't accept them
          allowReserved: true,
        },
      });

      if (error) {
        return { error };
      }

      const mapper = useMapper();
      return { data: mapper.toRecipe(data.data![0]) };
    },
    getHomePageContent: async () => {
      return await client.GET("/items/home_page");
    },
    getRecipesPageContent: async () => {
      return await client.GET("/items/recipes_page");
    },
    getIngredientUnitSingularPluralMapping: async () => {
      return await client.GET("/items/ingredient_unit_forms");
    },
  };
};
