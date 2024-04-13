import type { ServerRecipe, ServerImage } from "common/types/serverRecipe";
import type { Image, Recipe, RecipePreview } from "~/types/recipe";

export const RecipeMapper = {
  toClientRecipe(serverRecipe: ServerRecipe): Recipe {
    return {
      title: serverRecipe.title,
      note: serverRecipe.note,
      coverImage: serverRecipe.coverImage ? mapImage(serverRecipe.coverImage) : undefined,
      ingredientGroups: serverRecipe.ingredientGroups.map((ig) => {
        return {
          name: ig.name,
          ingredients: ig.ingredients.map((i) => {
            return {
              amount: i.amount,
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
              text: i.html,
              content: i.text,
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
  toClientPreview(serverRecipe: ServerRecipe): RecipePreview {
    return {
      title: serverRecipe.title,
      coverImage: serverRecipe.coverImage ? mapImage(serverRecipe.coverImage) : undefined,
      slug: serverRecipe.slug,
    };
  },
};

function mapImage(serverImage: ServerImage): Image {
  return {
    id: serverImage.id,
    title: serverImage.title,
    width: serverImage.width,
    height: serverImage.height,
    modifyDate: serverImage.modified_on,
  };
}
