export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const client = useDirectusApi({
    baseUrl: config.baseUrl,
    cfAccessClientId: config.cfAccessClientId,
    cfAccessClientSecret: config.cfAccessClientSecret,
  });

  const { data, error } = await client.getRecipesPageContent();

  if (error) {
    throw createError({
      status: 500,
      data: error,
    });
  }

  return data.data!;
});
