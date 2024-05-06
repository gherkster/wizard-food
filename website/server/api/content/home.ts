import { useDirectus } from "~/composables";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const directusClient = useDirectus({
    url: config.baseUrl,
    clientId: config.cfAccessClientId,
    clientSecret: config.cfAccessClientSecret,
  });

  return await directusClient.getHomePageContent();
});
