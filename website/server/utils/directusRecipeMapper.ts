import prand from "pure-rand";
import { generateText, type JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";
import type {
  ServerRecipe,
  InlineIngredient,
  ServerImage,
} from "../../../common/types/serverRecipe";

export function useMapper() {
  return {
    toRecipePayload,
  };
}

const toRecipePayload = (serverRecipe: ServerRecipe): RecipePayload => {
  assertCoverImageExists(serverRecipe.coverImage);
  assertCoverImageHasValue(serverRecipe.coverImage);

  const tags = buildTagList({
    course: serverRecipe.course,
    cuisine: serverRecipe.cuisine,
    diets: serverRecipe.diets as string[] | undefined, // The multiselect JSON type is an optional string array
    main_ingredients: serverRecipe.main_ingredients as string[] | undefined, // The multiselect JSON type is an optional string array
    method: serverRecipe.method,
  });

  return {
    id: serverRecipe.id!,
    title: serverRecipe.title,
    description: serverRecipe.description ? generateHTML(serverRecipe.description, extensions) : "",
    descriptionPlainText: serverRecipe.description
      ? generateText(serverRecipe.description, extensions)
      : "",
    descriptionSnippet: serverRecipe.description_snippet,
    cuisine: serverRecipe.cuisine ?? undefined,
    course: serverRecipe.course ?? undefined,
    note: serverRecipe.note ? generateHTML(serverRecipe.note, extensions) : "",
    coverImage: mapImage(serverRecipe.coverImage),
    ingredientGroups:
      serverRecipe.ingredientGroups?.map<IngredientGroup>((ig) => {
        if (typeof ig === "number") {
          throw new Error(
            "Ingredient group only has an identifier, the data fields have not been retrieved.",
          );
        }

        return {
          name: ig.name ?? undefined,
          ingredients:
            ig.ingredients?.map((i) => {
              if (typeof i === "number") {
                throw new Error(
                  "Ingredient only has an identifier, the data fields have not been retrieved.",
                );
              }

              if (!i.name_singular) {
                throw new Error(
                  `Recipe ${serverRecipe.title} includes a ingredient with no singular form name. Ingredient: ${i.id}`,
                );
              }
              if (!i.name_plural) {
                throw new Error(
                  `Recipe ${serverRecipe.title} includes a ingredient with no plural form name. Ingredient: ${i.id}`,
                );
              }

              return {
                amount: i.amount ?? undefined,
                unit: i.unit ?? undefined,
                name: {
                  singular: generateHTML(i.name_singular, extensions),
                  plural: generateHTML(i.name_plural, extensions),
                },
                note: i.note ?? undefined,
                inlineOnly: i.inline_only,
              };
            }) ?? [],
        };
      }) ?? [],
    instructionGroups:
      serverRecipe.instructionGroups?.map<InstructionGroup>((ig) => {
        if (typeof ig === "number") {
          throw new Error(
            "Instruction group only has an identifier, the data fields have not been retrieved.",
          );
        }

        return {
          name: ig.name ?? undefined,
          instructions:
            ig.instructions?.map<Instruction>((i) => {
              if (typeof i === "number") {
                throw new Error(
                  "Instruction only has an identifier, the data fields have not been retrieved.",
                );
              }

              if (i.inline_ingredients?.some((inline) => typeof inline === "string")) {
                throw new Error(
                  "Instruction inline_ingredients is only an identifier, the data fields have not been retrieved.",
                );
              }

              return {
                text: generateHTML(
                  insertRelationDataIntoContent(
                    i.text as JSONContent,
                    (i.inline_ingredients ?? []) as InlineIngredient[],
                  ),
                  extensions,
                ),
              };
            }) ?? [],
        };
      }) ?? [],
    preparationDuration: serverRecipe.preparationDuration ?? undefined,
    cookingDuration: serverRecipe.cookingDuration ?? undefined,
    customDurationName: serverRecipe.customDurationName ?? undefined,
    customDuration: serverRecipe.customDuration ?? undefined,
    servings: serverRecipe.servings ?? undefined,
    servingsType: serverRecipe.servings_type ?? undefined,
    slug: serverRecipe.slug,
    tags: tags,
    featuredTag: getRandomTag(tags, serverRecipe.id!),
    date_published: serverRecipe.date_published ?? undefined,
  };
};

const mapImage = (serverImage: ServerImage): Image => {
  return {
    // Assert that all the required fields have been provided, for an image this should always be the case.
    id: serverImage.id ?? throwExpression("Image ID must be provided"),
    title: serverImage.title ?? throwExpression("Image title must be provided"),
    width: serverImage.width ?? throwExpression("Image width must be provided"),
    height: serverImage.height ?? throwExpression("Image height must be provided"),
    modifyDate: serverImage.modified_on ?? throwExpression("Image modified_on must be provided"),
  };
};

function insertRelationDataIntoContent(
  content: JSONContent,
  inlineIngredients: InlineIngredient[],
) {
  if (content.type === "inline-ingredient" && content.attrs?.id) {
    const ingredient = inlineIngredients.find((i) => i.id === content.attrs!.id);
    content.attrs.data = ingredient?.ingredient_id;
  }

  content.content?.forEach((con) => insertRelationDataIntoContent(con, inlineIngredients));
  return content;
}

function getRandomTag(tags: string[], recipeId: number) {
  if (tags.length === 0) {
    return undefined;
  }

  const randomness = prand.xoroshiro128plus(recipeId);
  const [randomIndex] = prand.uniformIntDistribution(0, tags.length - 1, randomness);
  return tags[randomIndex];
}

type RecipeCategories = {
  cuisine?: string | null;
  course?: string | null;
  diets?: string[];
  method?: string | null;
  main_ingredients?: string[];
};

function buildTagList(categories: RecipeCategories): string[] {
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

function assertCoverImageExists(
  coverImage: (string | ServerImage) | null | undefined,
): asserts coverImage {
  if (!coverImage) {
    throw new Error("Recipe image not provided");
  }
}

function assertCoverImageHasValue(
  coverImage: string | ServerImage,
): asserts coverImage is ServerImage {
  if (typeof coverImage === "string") {
    throw new Error(
      "Recipe image only has an identifier, the data fields have not been retrieved.",
    );
  }
}
