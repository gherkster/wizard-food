import { useDirectusApi } from "~/clients/useDirectusApi";

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  const client = useDirectusApi();

  const { data: recipe, error } = await client.getRecipe(slug!);

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "A server error occurred",
    });
  }

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found",
    });
  }

  return recipe;
});
