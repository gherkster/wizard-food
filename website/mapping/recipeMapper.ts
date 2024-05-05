import type { ServerRecipe, ServerImage } from "common/types/serverRecipe";
import type { Image, Recipe } from "~/types/recipe";

export const RecipeMapper = {
  toClientRecipe(serverRecipe: ServerRecipe): Recipe {
    return {
      title: serverRecipe.title,
      description: serverRecipe.description_html,
      descriptionPlainText: serverRecipe.description_plain_text,
      descriptionSnippet: serverRecipe.description_snippet,
      note: serverRecipe.note_html,
      coverImage: mapImage(serverRecipe.coverImage),
      ingredientGroups: serverRecipe.ingredientGroups.map((ig) => {
        return {
          name: ig.name,
          ingredients: ig.ingredients.map((i) => {
            return {
              amount: i.amount,
              unit: i.unit,
              name: i.name_html,
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
      preparationDuration: serverRecipe.preparationDuration,
      cookingDuration: serverRecipe.cookingDuration,
      customDurationName: serverRecipe.customDurationName,
      customDuration: serverRecipe.customDuration,
      servings: serverRecipe.servings,
      servingsType: serverRecipe.servings_type,
      slug: serverRecipe.slug,
      tags: buildTagList(serverRecipe),
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

function buildTagList(recipe: ServerRecipe): string[] {
  const tags: string[] = [];
  if (recipe.cuisine) {
    tags.push(recipe.cuisine);
  }
  if (recipe.course) {
    tags.push(recipe.course);
  }
  if (recipe.diets) {
    tags.push(...recipe.diets);
  }
  return tags.sort();
}
