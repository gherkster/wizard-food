import { useDirectusApi } from "~/clients/useDirectusApi";
import type { IngredientUnitForm } from "~/types/mapping";

export default defineEventHandler(async () => {
  const client = useDirectusApi();

  const { data, error } = await client.getIngredientUnitSingularPluralMapping();

  if (error) {
    throw createError({
      status: 500,
      data: error,
    });
  }

  const unitVariants: IngredientUnitForm[] = data.data!.map((m) => {
    return {
      singularForm: m.singular_form ?? "",
      pluralForm: m.plural_form ?? "",
    };
  });

  return unitVariants;
});
