import { ServerRecipe } from "~/types/serverRecipe";
import { Recipe } from "~/types/recipe";
import Fraction from "fraction.js";

export const RecipeMapper = {
  toClientRecipe(serverRecipe: ServerRecipe): Recipe {
    return {
      title: serverRecipe.title,
      note: serverRecipe.note,
      coverImage: serverRecipe.coverImage
        ? {
            id: serverRecipe.coverImage.id,
            title: serverRecipe.coverImage.title,
            width: serverRecipe.coverImage.width,
            height: serverRecipe.coverImage.height,
            modifyDate: serverRecipe.coverImage.modified_on,
          }
        : undefined,
      ingredientGroups: serverRecipe.ingredientGroups.map((ig) => {
        return {
          name: ig.name,
          ingredients: ig.ingredients.map((i) => {
            return {
              amount: i.amount ? new Fraction(i.amount) : undefined,
              unit: i.unit,
              name: i.name,
              note: i.note,
            };
          }),
        };
      }),
      instructionGroups: serverRecipe.instructionGroups.map((ig) => {
        return {
          name: ig.name,
          instructions: ig.instructions.map((i) => {
            return {
              label: i.text,
            };
          }),
        };
      }),
      category: serverRecipe.category,
      cuisine: serverRecipe.cuisine,
      preparationDuration: serverRecipe.preparationDuration,
      cookingDuration: serverRecipe.cookingDuration,
      customDurationName: serverRecipe.customDurationName,
      customDuration: serverRecipe.customDuration,
      servings: serverRecipe.servings,
      slug: serverRecipe.slug,
      tags: serverRecipe.tags.map((t) => t.tags_id.value),
    };
  },
};
