import { defineNuxtPrepareHandler } from "nuxt-prepare/config";
import { useDirectusApi } from "./server/utils/useDirectusApi";
import { toRecipePayload } from "./server/utils/directusRecipeMapper";
import type { IngredientUnitForms, ServerRecipe } from "common/types/serverRecipe";

export default defineNuxtPrepareHandler(async () => {
  const client = useDirectusApi();

  const { data: recipesResponse, error: getRecipesError } = await client.getRecipes();

  if (getRecipesError) {
    throw getRecipesError;
  }

  if (!recipesResponse || recipesResponse.length === 0) {
    throw "No recipes returned from Directus";
  }

  const { data: unitForms, error: getUnitFormsError } = await client.getIngredientUnitForms();

  if (getUnitFormsError) {
    throw getUnitFormsError;
  }

  if (!unitForms || unitForms.length === 0) {
    throw "No ingredient unit forms returned from Directus";
  }

  /*
   * The map of all the singular and plural lookup values of an ingredient unit.
   * All the records are inserted twice, using the singular and plural unit names as keys,
   * since at this point in the mapping we only have access to the string value of the unit, and we want to prioritise faster lookup time.
   */
  const unitSingularPluralMap = new Map<string, IngredientUnitForms>();
  unitForms.forEach((uf) => {
    unitSingularPluralMap.set(mapKey(uf.singular_form), uf);
    unitSingularPluralMap.set(mapKey(uf.plural_form), uf);
  });

  const recipes = recipesResponse.map((recipe) =>
    toRecipePayload(recipe, {
      getUnitNames: (unit) => {
        return getSingularPluralMapping(unit, unitSingularPluralMap, recipe);
      },
    }),
  );

  return {
    ok: !getRecipesError && recipes.length > 0 && !getUnitFormsError && unitForms.length > 0,
    state: {
      recipes: recipes,
    },
  };
});

/** Get the singular and plural ingredient forms from the map of all combinations. */
const getSingularPluralMapping = (
  unit: string,
  unitSingularPluralMap: Map<string, IngredientUnitForms>,
  recipe: ServerRecipe,
) => {
  const singularPluralPair = unitSingularPluralMap.get(mapKey(unit));

  // It is not currently required to cover every scenario, as the lookup values just cover the most common units.
  if (!singularPluralPair) {
    console.warn(
      `No ingredient unit mapping found for ${unit} in recipe ${recipe.id} - ${recipe.title}`,
    );
    return {
      singular: unit,
      plural: unit,
    };
  }

  return {
    singular: singularPluralPair.singular_form,
    plural: singularPluralPair.plural_form,
  };
};

/** Get the key to identity an entry in the ingredient unit singular plural map */
const mapKey = (unit: string) => {
  // Use a consistently cased lookup key
  return unit.toUpperCase();
};
