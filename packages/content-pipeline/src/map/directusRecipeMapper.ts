import type { Recipe, SingularPluralPair } from "@wizard/content";
import type { ServerRecipe } from "@wizard/openapi";

import { hydrateRecipe } from "./hydrateRecipe";
import { mapToRecipe as mapHydratedToRecipe } from "./mapToRecipe";
import { mapToJsonLd } from "./mapToJsonLd";

export const mapToRecipe = (
  serverRecipe: ServerRecipe,
  getters: {
    getUnitNames: (unit: string) => SingularPluralPair;
  },
): Recipe => {
  const hydrated = hydrateRecipe(serverRecipe, getters);
  const recipe = mapHydratedToRecipe(hydrated);
  recipe.jsonLd = JSON.stringify(mapToJsonLd(hydrated));
  return recipe;
};
