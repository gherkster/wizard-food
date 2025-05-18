import prand from "pure-rand";
import { generateText, type JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";
import type {
  ServerRecipe,
  ServerImage,
  ServerIngredient,
  ServerIngredientGroup,
  ServerInstructionGroup,
  ServerInstruction,
  ServerInlineIngredient,
} from "../../../common/types/serverRecipe";
import extensions from "./extensions";
import { assertIsHydrated } from "./asserts";
import { throwExpression } from "../../shared/utils/error";
import * as path from "path";
import type {
  Ingredient,
  IngredientGroup,
  InlineIngredient,
  Instruction,
  InstructionGroup,
  SingularPluralPair,
} from "~~/shared/types/recipe";

/**
 * Maps the recipe output from Directus into a more usable payload to be provided to the serverside functionality.
 * @param serverRecipe The recipe list output from the Directus API
 * @param getUnitNames The callback function to retrieve the singular and plural names for a given ingredient unit
 */
export const toRecipePayload = (
  serverRecipe: ServerRecipe,
  getters: {
    getUnitNames: (unit: string) => SingularPluralPair;
  },
): RecipePayload => {
  if (!serverRecipe.coverImage) {
    throw new Error("Recipe image not provided");
  }
  assertIsHydrated(serverRecipe.coverImage);

  const tags = buildTagList({
    course: serverRecipe.course,
    cuisine: serverRecipe.cuisine,
    diets: serverRecipe.diets as string[] | undefined, // The multiselect JSON type is an optional string array
    main_ingredients: serverRecipe.main_ingredients as string[] | undefined, // The multiselect JSON type is an optional string array
    method: serverRecipe.method,
  });

  const mapIngredientGroup = (ingredientGroup: ServerIngredientGroup): IngredientGroup => {
    return {
      name: ingredientGroup.name ?? undefined,
      ingredients:
        ingredientGroup.ingredients?.map<Ingredient>((i) => {
          assertIsHydrated(i);

          if (!i.name_singular) {
            throw new Error(
              `Ingredient group ${ingredientGroup.id} includes a ingredient with no singular form name. Ingredient: ${i.id}`,
            );
          }
          if (!i.name_plural) {
            throw new Error(
              `Ingredient group ${ingredientGroup.id} includes a ingredient with no plural form name. Ingredient: ${i.id}`,
            );
          }

          return mapIngredient(i);
        }) ?? [],
    };
  };

  const mapIngredient = (ingredient: ServerIngredient): Ingredient => {
    return {
      amount: ingredient.amount ?? undefined,
      unit: ingredient.unit ? getters.getUnitNames(ingredient.unit) : undefined,
      name: {
        singular: generateHTML(ingredient.name_singular ?? {}, extensions),
        plural: generateHTML(ingredient.name_plural ?? {}, extensions),
      },
      note: ingredient.note ?? undefined,
      inlineOnly: ingredient.inline_only,
    };
  };

  const mapInstructionGroup = (instructionGroup: ServerInstructionGroup): InstructionGroup => {
    return {
      name: instructionGroup.name ?? undefined,
      instructions:
        instructionGroup.instructions?.map<Instruction>((i) => {
          assertIsHydrated(i);

          if (i.inline_ingredients?.some((inline) => typeof inline === "string")) {
            throw new Error(
              "Instruction inline_ingredients is only an identifier, the data fields have not been retrieved.",
            );
          }

          return mapInstruction(i);
        }) ?? [],
    };
  };

  const mapInstruction = (serverInstruction: ServerInstruction): Instruction => {
    return {
      text: generateHTML(
        insertRelationDataIntoContent(
          serverInstruction.text as JSONContent,
          (serverInstruction.inline_ingredients ?? []) as ServerInlineIngredient[],
        ),
        extensions,
      ),
    };
  };

  function insertRelationDataIntoContent(
    content: JSONContent,
    inlineIngredients: ServerInlineIngredient[],
  ) {
    if (content.type === "inline-ingredient" && content.attrs?.id) {
      const serverIngredient = inlineIngredients.find(
        (i) => i.id === content.attrs!.id,
      )?.ingredient_id;

      if (serverIngredient) {
        assertIsHydrated(serverIngredient);

        // Set the tiptap data attribute with the recipe data, which is used when rendering to HTML to populate the HTML data attributes
        const ingredient = mapIngredient(serverIngredient);

        content.attrs.data = {
          amount: ingredient.amount,
          unit: ingredient.unit,
          // Use plain text for inline ingredient properties
          name: {
            singular: generateText(serverIngredient.name_singular ?? {}, extensions),
            plural: generateText(serverIngredient.name_plural ?? {}, extensions),
          },
        } satisfies InlineIngredient;
      }
    }

    content.content?.forEach((con) => insertRelationDataIntoContent(con, inlineIngredients));
    return content;
  }

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
        assertIsHydrated(ig);

        return mapIngredientGroup(ig);
      }) ?? [],
    instructionGroups:
      serverRecipe.instructionGroups?.map<InstructionGroup>((ig) => {
        assertIsHydrated(ig);

        return mapInstructionGroup(ig);
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
    favourite: serverRecipe.favourite,
    datePublished: serverRecipe.date_published ?? undefined,
  };
};

const mapImage = (serverImage: ServerImage): Image => {
  return {
    // Assert that all the required fields have been provided, for an image this should always be the case.
    id: serverImage.id ?? throwExpression("Image ID must be provided"),
    title: serverImage.title ?? throwExpression("Image title must be provided"),
    fileName: serverImage.filename_download
      ? // Remove the file extension, as it the file extension of the uploaded file, not the transformed one the client will receive
        path.parse(serverImage.filename_download).name
      : throwExpression("Image filename_download must be provided"),
    width: serverImage.width ?? throwExpression("Image width must be provided"),
    height: serverImage.height ?? throwExpression("Image height must be provided"),
    modifyDate: serverImage.modified_on ?? throwExpression("Image modified_on must be provided"),
    metadata: {
      base64Url:
        serverImage.metadata?.base64Url ??
        throwExpression("Image base64 thumbnail URL must be provided"),
    },
  };
};

const getRandomTag = (tags: string[], recipeId: number) => {
  if (tags.length === 0) {
    return undefined;
  }

  const randomness = prand.xoroshiro128plus(recipeId);
  const [randomIndex] = prand.uniformIntDistribution(0, tags.length - 1, randomness);
  return tags[randomIndex];
};

type RecipeCategories = {
  cuisine?: string | null;
  course?: string | null;
  diets?: string[];
  method?: string | null;
  main_ingredients?: string[];
};

const buildTagList = (categories: RecipeCategories): string[] => {
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
};
