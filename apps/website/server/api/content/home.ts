export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const client = useDirectusApi({
    baseUrl: config.baseUrl,
    cfAccessClientId: config.cfAccessClientId,
    cfAccessClientSecret: config.cfAccessClientSecret,
  });

  const { data, error } = await client.getHomePageContent();

  if (error) {
    throw createError({
      status: 500,
      data: error,
    });
  }

  return data.data!;
});
