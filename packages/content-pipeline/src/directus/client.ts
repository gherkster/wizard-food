import type { paths } from "@wizard/openapi";
import createClient, { type Middleware } from "openapi-fetch";

const searchFields = [
  "*",
  "coverImage.*",
  "ingredientGroups.name",
  "ingredientGroups.ingredients.*",
  "instructionGroups.name",
  "instructionGroups.instructions.id",
  "instructionGroups.instructions.text",
  "instructionGroups.instructions.image.id",
  "instructionGroups.instructions.inline_ingredients.*",
  "instructionGroups.instructions.inline_ingredients.ingredient_id.*",
  "instructionGroups.instructions.image.*",
];

export type DirectusRuntimeConfig = {
  baseUrl: string;
  cfAccessClientId: string;
  cfAccessClientSecret: string;
};

const authMiddleware = (config: DirectusRuntimeConfig): Middleware => ({
  async onRequest({ request }) {
    request.headers.set("CF-Access-Client-Id", config.cfAccessClientId);
    request.headers.set("CF-Access-Client-Secret", config.cfAccessClientSecret);

    return request;
  },
});

export const useDirectusApi = (config: DirectusRuntimeConfig) => {
  const client = createClient<paths>({
    baseUrl: config.baseUrl,
  });

  client.use(authMiddleware(config));

  const getRecipes = async () => {
    const { data, error } = await client.GET("/items/recipes", {
      params: {
        query: {
          fields: searchFields,
          filter: `{"status":{"_eq":"published"}}`,
          sort: ["-date_published"],
          limit: -1,
        },
      },
      querySerializer: {
        allowReserved: true,
      },
    });

    if (error) {
      return { error };
    }

    const now = new Date();

    return {
      data: data.data?.sort(
        (a, b) =>
          (b.date_published ? new Date(b.date_published) : now).getTime() -
          (a.date_published ? new Date(a.date_published) : now).getTime(),
      ),
    };
  };

  const getHomePageContent = async () => {
    return await client.GET("/items/home_page/{id}", {
      params: {
        path: {
          id: 1,
        },
      },
    });
  };

  const getRecipesPageContent = async () => {
    return await client.GET("/items/recipes_page/{id}", {
      params: {
        path: {
          id: 1,
        },
      },
    });
  };

  const getIngredientUnitForms = async () => {
    const { data, error } = await client.GET("/items/ingredient_unit_forms");

    if (error) {
      return { error };
    }

    return { data: data.data };
  };

  return {
    getRecipes,
    getHomePageContent,
    getRecipesPageContent,
    getIngredientUnitForms,
  };
};
