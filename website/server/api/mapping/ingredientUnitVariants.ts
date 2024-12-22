import { useDirectusApi } from "~/clients/useDirectusApi";

export default defineEventHandler(async () => {
  const client = useDirectusApi();

  const { data, error } = await client.getIngredientUnitSingularPluralMapping();

  if (error) {
    return createError({
      status: 500,
      data: error,
    });
  }

  return data.data!.map((m) => {
    return {
      singularForm: m.singular_form,
      pluralForm: m.plural_form,
    };
  });
});
