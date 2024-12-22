import { useDirectusApi } from "~/clients/useDirectusApi";

export default defineEventHandler(async () => {
  const client = useDirectusApi();

  const { data, error } = await client.getHomePageContent();

  if (error) {
    throw createError({
      status: 500,
      data: error,
    });
  }

  return data.data![0];
});
