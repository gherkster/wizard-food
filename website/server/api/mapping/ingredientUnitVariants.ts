import { useDirectus } from "~/composables";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const directusClient = useDirectus({
    url: config.baseUrl,
    clientId: config.cfAccessClientId,
    clientSecret: config.cfAccessClientSecret,
  });

  const mappingEntries = await directusClient.getIngredientUnitSingularPluralMapping();
  return mappingEntries.map((m) => {
    return {
      singularForm: m.singular_form,
      pluralForm: m.plural_form,
    };
  });
});
