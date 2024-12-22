import { useDirectusApi } from "~/clients/useDirectusApi";

export default defineEventHandler(async () => {
  const client = useDirectusApi();

  const { data, error } = await client.getRecipesPageContent();

  if (error) {
    throw createError({
      status: 500,
      data: error,
    });
  }

  return data.data![0];
});
