import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "@wizard/openapi";
import { throwExpression } from "../../shared/utils/error";

const searchFields = [
  "*",
  "coverImage.*",
  "ingredientGroups.name",
  "ingredientGroups.ingredients.*",
  "instructionGroups.name",
  "instructionGroups.instructions.id",
  "instructionGroups.instructions.text",
  "instructionGroups.instructions.image.id",
  // Gets the inline_ingredient relationships from the instruction to the specified ingredient
  "instructionGroups.instructions.inline_ingredients.*",
  "instructionGroups.instructions.inline_ingredients.ingredient_id.*",
  "instructionGroups.instructions.image.*",
];

const requiredConfig = (name: string, value: string | undefined) =>
  value ?? throwExpression(`${name} environment variable not set`);

type DirectusRuntimeConfig = {
  baseUrl?: string;
  cfAccessClientId?: string;
  cfAccessClientSecret?: string;
};

const resolveConfig = (config: DirectusRuntimeConfig = {}): Required<DirectusRuntimeConfig> => {
  return {
    baseUrl: requiredConfig("NUXT_BASE_URL", config.baseUrl ?? process.env.NUXT_BASE_URL),
    cfAccessClientId: requiredConfig(
      "CF-Access-Client-Id",
      config.cfAccessClientId ?? process.env.NUXT_CF_ACCESS_CLIENT_ID,
    ),
    cfAccessClientSecret: requiredConfig(
      "CF-Access-Client-Secret",
      config.cfAccessClientSecret ?? process.env.NUXT_CF_ACCESS_CLIENT_SECRET,
    ),
  };
};

const authMiddleware = (config: Required<DirectusRuntimeConfig>): Middleware => ({
  async onRequest({ request }) {
    request.headers.set("CF-Access-Client-Id", config.cfAccessClientId);
    request.headers.set("CF-Access-Client-Secret", config.cfAccessClientSecret);

    return request;
  },
});

export const useDirectusApi = (config?: DirectusRuntimeConfig) => {
  const resolvedConfig = resolveConfig(config);

  const client = createClient<paths>({
    baseUrl: resolvedConfig.baseUrl,
  });

  client.use(authMiddleware(resolvedConfig));

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
        // Don't percent encode query parameters, as directus won't accept them
        allowReserved: true,
      },
    });

    if (error) {
      return { error };
    }

    const now = new Date();

    return {
      // A missing date_published value means the recipe is brand new and the publish date has not been set in the record yet, so use the current time.
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

  /**
   * Get the singular and plural forms of ingredient units
   * @example
   * {
   *    id: 1,
   *    singular_form: "clove",
   *    plural_form: "cloves"
   * }
   */
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
