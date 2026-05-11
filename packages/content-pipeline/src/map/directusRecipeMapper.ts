import type {
  Image,
  Ingredient,
  IngredientGroup,
  Instruction,
  InstructionGroup,
  Recipe,
  SingularPluralPair,
  RichTextContent,
  ImagePurpose,
  FacetKey,
} from "@wizard/content";
import type {
  ServerImage,
  ServerIngredient,
  ServerIngredientGroup,
  ServerInlineIngredient,
  ServerInstruction,
  ServerInstructionGroup,
  ServerRecipe,
} from "@wizard/openapi";
import dayjs from "dayjs";
import prand from "pure-rand";

import { formatDuration, secondsToDuration } from "../build/formatting";
import { hydrateInlineIngredientData } from "../hydrateInlineIngredientData";
import { renderRichTextHtml, renderRichTextText } from "../render";
import { assertIsHydrated, throwExpression } from "../utils";
import { resolveConfig } from "../utils/config";
import { buildImageVariant } from "./cloudinaryImage";

export const mapToRecipe = (
  serverRecipe: ServerRecipe,
  getters: {
    getUnitNames: (unit: string) => SingularPluralPair;
  },
): Recipe => {
  if (isNil(serverRecipe.coverImage)) {
    throw new Error("Recipe image not provided");
  }

  assertIsHydrated(serverRecipe.coverImage, "coverImage");

  const mapIngredientGroup = (ingredientGroup: ServerIngredientGroup): IngredientGroup => {
    return {
      name: ingredientGroup.name ?? undefined,
      ingredients:
        ingredientGroup.ingredients?.map<Ingredient>((i) => {
          assertIsHydrated(i, "ingredient");

          if (isNil(i.name_singular)) {
            throw new Error(
              `Ingredient group ${ingredientGroup.id} includes a ingredient with no singular form name. Ingredient: ${i.id}`,
            );
          }
          if (isNil(i.name_plural)) {
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
          assertIsHydrated(i, "instruction");
          i.inline_ingredients?.forEach((ii) => assertIsHydrated(ii, "inline_ingredient"));

          return mapInstruction(i);
        }) ?? [],
    };
  };

  const mapInstruction = (serverInstruction: ServerInstruction): Instruction => {
    const instructionText = (serverInstruction.text ?? {}) as RichTextContent;

    return {
      text: renderRichTextHtml(
        hydrateInlineIngredientData(instructionText, (inlineIngredientId) =>
          getInlineIngredientData(
            inlineIngredientId,
            (serverInstruction.inline_ingredients ?? []) as ServerInlineIngredient[],
          ),
        ),
      ),
    };
  };

  const getInlineIngredientData = (
    inlineIngredientId: string,
    inlineIngredients: ServerInlineIngredient[],
  ) => {
    const serverIngredient = inlineIngredients.find(
      (inlineIngredient) => inlineIngredient.id === inlineIngredientId,
    )?.ingredient_id;

    if (isNil(serverIngredient)) {
      return undefined;
    }

    assertIsHydrated(serverIngredient, "serverIngredient");
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

  const preparationDuration = !isNil(serverRecipe.preparationDuration)
    ? { name: "Preparation", duration: secondsToDuration(serverRecipe.preparationDuration) }
    : undefined;

  const cookingDuration = !isNil(serverRecipe.cookingDuration)
    ? { name: "Cooking", duration: secondsToDuration(serverRecipe.cookingDuration) }
    : undefined;

  const customDuration =
    !isNil(serverRecipe.customDuration) && !isNil(serverRecipe.customDurationName)
      ? {
          name: serverRecipe.customDurationName,
          duration: secondsToDuration(serverRecipe.customDuration),
        }
      : undefined;

  const recipeDurations = [preparationDuration, cookingDuration, customDuration].filter((d) => !!d);

  const totalDuration = recipeDurations.reduce(
    (acc, curr) => acc.add(curr.duration),
    dayjs.duration(0),
  );

  return {
    cuisine: serverRecipe.cuisine ?? undefined,
    course: serverRecipe.course ?? undefined,
    coverImage: mapImage(serverRecipe.coverImage, "cover"),
    datePublished: serverRecipe.date_published ?? undefined,
    description: !isNil(serverRecipe.description)
      ? renderRichTextHtml(serverRecipe.description as RichTextContent)
      : "",
    descriptionPlainText: !isNil(serverRecipe.description)
      ? renderRichTextText(serverRecipe.description as RichTextContent)
      : "",
    descriptionSnippet: serverRecipe.description_snippet,
    diets: serverRecipe.diets as string[] | undefined,
    durationTotal:
      totalDuration !== undefined
        ? {
            isoDuration: totalDuration.toISOString(),
            label: "Total",
            minutes: totalDuration.asMinutes(),
            text: formatDuration(totalDuration),
          }
        : undefined,
    durationComponents: recipeDurations.map((d) => {
      return {
        isoDuration: d.duration.toISOString(),
        label: d.name,
        minutes: d.duration.asMinutes(),
        text: formatDuration(d.duration),
      };
    }),
    favourite: serverRecipe.favourite,
    ingredientGroups:
      serverRecipe.ingredientGroups?.map<IngredientGroup>((ig) => {
        assertIsHydrated(ig, "ingredientGroup");

        return mapIngredientGroup(ig);
      }) ?? [],
    instructionGroups:
      serverRecipe.instructionGroups?.map<InstructionGroup>((ig) => {
        assertIsHydrated(ig, "instructionGroup");

        return mapInstructionGroup(ig);
      }) ?? [],
    mainIngredients: serverRecipe.main_ingredients as string[] | undefined,
    note: !isNil(serverRecipe.note) ? renderRichTextHtml(serverRecipe.note as RichTextContent) : "",
    previewImage: mapImage(serverRecipe.coverImage, "preview"),
    title: serverRecipe.title,
    servings: serverRecipe.servings,
    servingsType: {
      singular: serverRecipe.serving_type,
      plural: serverRecipe.servings_type,
    },
    slug: serverRecipe.slug,
    featuredTag: getRandomTag(
      {
        course: [serverRecipe.course],
        cuisine: [serverRecipe.cuisine],
        diets: (serverRecipe.diets as string[] | null) ?? [],
      },
      serverRecipe.id!,
    ),
  };
};

const mapImage = (serverImage: ServerImage, purpose: ImagePurpose): Image => {
  const imageId = serverImage.id ?? throwExpression("Image ID must be provided");

  const modifiedOn =
    serverImage.modified_on ?? throwExpression("Image modified_on must be provided");

  const config = resolveConfig();

  const variant = buildImageVariant(config, imageId, modifiedOn, purpose);

  return {
    ...variant,
    base64ThumbnailUrl:
      serverImage.metadata?.base64Url ??
      throwExpression("Image base64 thumbnail URL must be provided"),
    height: serverImage.height ?? throwExpression("Image height must be provided"),
    modifiedOn,
    title: serverImage.title ?? throwExpression("Image title must be provided"),
    width: serverImage.width ?? throwExpression("Image width must be provided"),
  };
};

const getRandomTag = (facets: Record<FacetKey, string[]>, recipeId: number) => {
  const tags = Object.values(facets).flatMap((f) => f);

  if (tags.length === 0) {
    return undefined;
  }

  const randomness = prand.xoroshiro128plus(recipeId);
  const [randomIndex] = prand.uniformIntDistribution(0, tags.length - 1, randomness);
  return tags[randomIndex];
};

const isNil = (value: unknown) => {
  return value === undefined || value === null;
};
