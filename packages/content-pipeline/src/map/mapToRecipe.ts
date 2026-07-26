import type { Instruction, InstructionGroup, Recipe } from "@wizard/content";

import type { HydratedInstruction, HydratedInstructionGroup, HydratedRecipe } from "./types";

export const mapToRecipe = (hydrated: HydratedRecipe): Recipe => {
  return {
    cuisine: hydrated.cuisine,
    course: hydrated.course,
    coverImage: hydrated.coverImage,
    datePublished: hydrated.datePublished,
    description: hydrated.descriptionHtml,
    descriptionPlainText: hydrated.descriptionPlainText,
    descriptionSnippet: hydrated.descriptionSnippet,
    diets: hydrated.diets,
    durationComponents: hydrated.durationComponents,
    durationTotal: hydrated.durationTotal,
    favourite: hydrated.favourite,
    featuredTag: hydrated.featuredTag,
    ingredientGroups: hydrated.ingredientGroups,
    instructionGroups: mapHydratedInstructionGroups(hydrated.instructionGroups),
    mainIngredients: hydrated.mainIngredients,
    note: hydrated.note,
    previewImage: hydrated.previewImage,
    servings: hydrated.servings,
    servingsType: hydrated.servingsType,
    slug: hydrated.slug,
    title: hydrated.title,
  };
};

const mapHydratedInstructionGroups = (
  groups: HydratedInstructionGroup[],
): InstructionGroup[] => {
  return groups.map((group): InstructionGroup => {
    return {
      name: group.name,
      instructions: group.instructions.map(mapHydratedInstruction),
    };
  });
};

const mapHydratedInstruction = (
  instruction: HydratedInstruction,
): Instruction => {
  return {
    text: instruction.html,
  };
};
