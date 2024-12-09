import prand from "pure-rand";
import { useRecipeFormatter } from "./useRecipeFormatter";
import type { ServerImage, ServerRecipe, ServerRecipeCategories, ServerRecipePreview } from "common/types/serverRecipe";
import type { Image, Recipe, RecipePreview } from "~/types/recipe";

export function useMapper() {
  return {
    toRecipePreview,
    toRecipe,
  };
}

function toRecipe(serverRecipe: ServerRecipe): Recipe {
  return {
    title: serverRecipe.title,
    description: serverRecipe.description_html,
    descriptionPlainText: serverRecipe.description_plain_text,
    descriptionSnippet: serverRecipe.description_snippet,
    cuisine: serverRecipe.cuisine,
    course: serverRecipe.course,
    note: serverRecipe.note_html,
    coverImage: mapImage(serverRecipe.coverImage),
    ingredientGroups: serverRecipe.ingredientGroups.map((ig) => {
      return {
        name: ig.name,
        ingredients: ig.ingredients.map((i) => {
          return {
            amount: i.amount,
            unit: i.unit,
            name: {
              singular: i.name_singular_html,
              plural: i.name_plural_html,
            },
            note: i.note,
            inlineOnly: i.inline_only,
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
}

function toRecipePreview(serverRecipePreview: ServerRecipePreview): RecipePreview {
  return {
    title: serverRecipePreview.title,
    descriptionSnippet: serverRecipePreview.description_snippet,
    tags: buildTagList(serverRecipePreview),
    featuredTag: getRandomTag(serverRecipePreview),
    totalDuration: getTotalDuration(serverRecipePreview),
    coverImage: mapImage(serverRecipePreview.coverImage),
    slug: serverRecipePreview.slug,
  };
}

function mapImage(serverImage: ServerImage): Image {
  return {
    id: serverImage.id,
    title: serverImage.title,
    width: serverImage.width,
    height: serverImage.height,
    modifyDate: serverImage.modified_on,
  };
}

function getRandomTag(recipe: ServerRecipePreview) {
  const tags = buildTagList(recipe);
  if (tags.length === 0) {
    return undefined;
  }

  // TODO: Is this randomness enough with incrementing integers?
  const randomness = prand.xoroshiro128plus(recipe.id);
  const [randomIndex] = prand.uniformIntDistribution(0, tags.length - 1, randomness);
  return tags[randomIndex];
}

const formatter = useRecipeFormatter();
function getTotalDuration(recipe: ServerRecipePreview) {
  const totalDuration =
    (recipe.preparationDuration ?? 0) + (recipe.cookingDuration ?? 0) + (recipe.customDuration ?? 0);
  if (totalDuration === 0) {
    return "";
  }

  return formatter.formatDuration(formatter.secondsToDuration(totalDuration));
}

function buildTagList(categories: ServerRecipeCategories): string[] {
  const tags: string[] = [];
  if (categories.cuisine) {
    tags.push(categories.cuisine);
  }
  if (categories.course) {
    tags.push(categories.course);
  }
  if (categories.diets) {
    tags.push(...categories.diets);
  }
  if (categories.method) {
    tags.push(categories.method);
  }
  if (categories.main_ingredients) {
    tags.push(...categories.main_ingredients);
  }
  return tags.sort();
}
