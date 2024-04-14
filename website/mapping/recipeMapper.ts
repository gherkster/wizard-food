import type { ServerRecipe, ServerImage } from "common/types/serverRecipe";
import type { Image, Recipe, RecipePreview } from "~/types/recipe";
import prand from "pure-rand";

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
  toClientPreview(serverRecipe: ServerRecipe): RecipePreview {
    return {
      title: serverRecipe.title,
      featuredTag: getRandomTag(serverRecipe),
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

function getRandomTag(recipe: ServerRecipe) {
  const tags = buildTagList(recipe);
  if (tags.length === 0) {
    return undefined;
  }

  const randomness = prand.xoroshiro128plus(recipe.id);
  const [randomIndex] = prand.uniformIntDistribution(0, tags.length - 1, randomness);
  return tags[randomIndex];
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
