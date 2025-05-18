import type { components } from "./directus-schema";

type Schemas = components["schemas"];

export type ServerRecipe = Schemas["ItemsRecipes"];

export type ServerIngredientGroup = Schemas["ItemsIngredientGroups"];

export type ServerIngredient = Schemas["ItemsIngredients"];

export type ServerInlineIngredient = Schemas["ItemsInlineIngredients"];

export type ServerInstructionGroup = Schemas["ItemsInstructionGroups"];

export type ServerInstruction = Schemas["ItemsInstructions"];

export type IngredientUnitForms = Schemas["ItemsIngredientUnitForms"];

export type ServerImage = Schemas["Files"];
