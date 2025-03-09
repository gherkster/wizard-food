import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "../../../common/types/directus-schema";
import { useMapper } from "./directusRecipeMapper";

const client = createClient<paths>({
  baseUrl: process.env.NUXT_BASE_URL ?? useRuntimeConfig().baseUrl,
});

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    request.headers.set(
      "CF-Access-Client-Id",
      process.env.NUXT_CF_ACCESS_CLIENT_ID ??
        useRuntimeConfig().cfAccessClientId ??
        throwExpression("CF-Access-Client-Id environment variable not set"),
    );
    request.headers.set(
      "CF-Access-Client-Secret",
      process.env.NUXT_CF_ACCESS_CLIENT_SECRET ??
        useRuntimeConfig().cfAccessClientSecret ??
        throwExpression("CF-Access-Client-Secret environment variable not set"),
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
  `${path}.metadata`,
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

    const mapper = useMapper();
    const now = new Date();

    return {
      data: data.data
        ?.map((r) => mapper.toRecipePayload(r))
        // A missing date_published value means the recipe is brand new and the publish date has not been set in the record yet, so use the current time.
        .sort(
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

  const getIngredientUnitSingularPluralMapping = async () => {
    return await client.GET("/items/ingredient_unit_forms");
  };

  return {
    getRecipes,
    getHomePageContent,
    getRecipesPageContent,
    getIngredientUnitSingularPluralMapping,
  };
};
