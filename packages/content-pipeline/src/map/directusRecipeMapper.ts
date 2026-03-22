import path from "node:path";
import prand from "pure-rand";
import type { RichTextContent } from "@wizard/content/shared";
import type {
  Image,
  Ingredient,
  IngredientGroup,
  Instruction,
  InstructionGroup,
  RecipePayload,
  SingularPluralPair,
} from "@wizard/content/store";
import type {
  ServerImage,
  ServerIngredient,
  ServerIngredientGroup,
  ServerInlineIngredient,
  ServerInstruction,
  ServerInstructionGroup,
  ServerRecipe,
} from "@wizard/openapi";
import { assertIsHydrated, throwExpression } from "../utils";
import { buildSignedImageVariants } from "./cloudinaryImage";
import { hydrateInlineIngredientData } from "../hydrateInlineIngredientData";
import { renderRichTextHtml, renderRichTextText } from "../render";

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
    diets: serverRecipe.diets as string[] | undefined,
    main_ingredients: serverRecipe.main_ingredients as string[] | undefined,
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
        singular: renderRichTextHtml((ingredient.name_singular ?? {}) as RichTextContent),
        plural: renderRichTextHtml((ingredient.name_plural ?? {}) as RichTextContent),
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
    const instructionText = (serverInstruction.text ?? {}) as RichTextContent;

    return {
      text: renderRichTextHtml(
        hydrateInlineIngredientData(
          instructionText,
          (inlineIngredientId) =>
            getInlineIngredientData(
              inlineIngredientId,
              (serverInstruction.inline_ingredients ?? []) as ServerInlineIngredient[],
            ),
        ),
      ),
      image: serverInstruction.image
        ? mapImage(assertHydratedImage(serverInstruction.image))
        : undefined,
    };
  };

  const getInlineIngredientData = (
    inlineIngredientId: string,
    inlineIngredients: ServerInlineIngredient[],
  ) => {
    const serverIngredient = inlineIngredients.find(
      (inlineIngredient) => inlineIngredient.id === inlineIngredientId,
    )?.ingredient_id;

    if (!serverIngredient) {
      return undefined;
    }

    assertIsHydrated(serverIngredient);
    const ingredient = mapIngredient(serverIngredient);

    return {
      amount: ingredient.amount,
      unit: ingredient.unit,
      name: {
        singular: renderRichTextText((serverIngredient.name_singular ?? {}) as RichTextContent),
        plural: renderRichTextText((serverIngredient.name_plural ?? {}) as RichTextContent),
      },
    };
  };

  return {
    id: serverRecipe.id!,
    title: serverRecipe.title,
    description: serverRecipe.description
      ? renderRichTextHtml(serverRecipe.description as RichTextContent)
      : "",
    descriptionPlainText: serverRecipe.description
      ? renderRichTextText(serverRecipe.description as RichTextContent)
      : "",
    descriptionSnippet: serverRecipe.description_snippet,
    cuisine: serverRecipe.cuisine ?? undefined,
    course: serverRecipe.course ?? undefined,
    note: serverRecipe.note ? renderRichTextHtml(serverRecipe.note as RichTextContent) : "",
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
    servings: serverRecipe.servings,
    servingsType: {
      singular: serverRecipe.serving_type,
      plural: serverRecipe.servings_type,
    },
    slug: serverRecipe.slug,
    tags: tags,
    featuredTag: getRandomTag(tags, serverRecipe.id!),
    favourite: serverRecipe.favourite,
    datePublished: serverRecipe.date_published ?? undefined,
  };
};

const assertHydratedImage = (image: ServerImage | string | number): ServerImage => {
  assertIsHydrated(image);
  return image;
};

const mapImage = (serverImage: ServerImage): Image => {
  const imageId = serverImage.id ?? throwExpression("Image ID must be provided");
  const modifyDate = serverImage.modified_on ?? throwExpression("Image modified_on must be provided");
  const signedVariants = buildSignedImageVariants({
    id: imageId,
    modifiedOn: modifyDate,
  });

  return {
    id: imageId,
    title: serverImage.title ?? throwExpression("Image title must be provided"),
    fileName: serverImage.filename_download
      ? path.parse(serverImage.filename_download).name
      : throwExpression("Image filename_download must be provided"),
    width: serverImage.width ?? throwExpression("Image width must be provided"),
    height: serverImage.height ?? throwExpression("Image height must be provided"),
    modifyDate,
    variants: signedVariants.variants,
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
