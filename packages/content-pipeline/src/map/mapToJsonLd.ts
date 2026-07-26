import { formatIngredient } from "@wizard/content";

import type { HydratedRecipe } from "./types";

export const mapToJsonLd = (hydrated: HydratedRecipe): object => {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    cookTime: hydrated.durationComponents.find((d) => d.type === "cooking")?.isoDuration,
    name: hydrated.title,
    description: hydrated.descriptionPlainText,
    image: hydrated.coverImage.src,
    prepTime: hydrated.durationComponents.find((d) => d.type === "preparation")?.isoDuration,
    recipeCategory: hydrated.course,
    recipeCuisine: hydrated.cuisine,
    recipeIngredient: hydrated.ingredientGroups
      .flatMap((ig) => ig.ingredients)
      .map((i) =>
        formatIngredient({
          amount: i.amount,
          name: i.amount !== undefined && i.amount > 1 ? i.namePlain.plural : i.namePlain.singular,
          unit: i.amount !== undefined && i.amount > 1 ? i.unit?.plural : i.unit?.singular,
          note: "",
        }),
      ),
    recipeInstructions: hydrated.instructionGroups
      .flatMap((ig) => ig.instructions)
      .map((i) => ({
        "@type": "HowToStep",
        text: i.plainText,
      })),
    recipeYield:
      hydrated.servings > 1
        ? `${hydrated.servings} ${hydrated.servingsType.plural}`
        : `${hydrated.servings} ${hydrated.servingsType.singular}`,
    keywords: [...(hydrated.diets ?? []), ...(hydrated.mainIngredients ?? [])].join(", "),
    totalTime: hydrated.durationTotal?.isoDuration,
  };
};
