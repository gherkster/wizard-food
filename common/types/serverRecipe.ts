import type { JSONContent } from "@tiptap/core";

export type ServerRecipe = ServerRecipeCategories & {
  id: number;
  title: string;
  description: JSONContent | null;
  description_snippet: string;
  description_html?: string;
  description_plain_text?: string;
  note?: JSONContent | null;
  note_html?: string;
  favourite: boolean;
  coverImage: ServerImage;
  slug: string;
  preparationDuration?: number;
  cookingDuration?: number;
  customDurationName?: string;
  customDuration?: number;
  servings?: number;
  servings_type?: string;
  ingredientGroups: ServerIngredientGroup[];
  instructionGroups: ServerInstructionGroup[];
  status: "published" | "draft";
  date_created: Date;
};

export type ServerRecipePreview = ServerRecipeCategories & {
  id: number;
  date_created: string;
  slug: string;
  title: string;
  description_snippet: string;
  coverImage: ServerImage;
  favourite: boolean;
  preparationDuration?: number;
  cookingDuration?: number;
  customDuration?: number;
};

export type ServerRecipeCategories = {
  cuisine?: string;
  course?: string;
  main_ingredients?: string[];
  diets?: string[];
  method?: string;
};

type ServerIngredientGroup = {
  name?: string;
  ingredients: ServerIngredient[];
};

export type ServerIngredient = {
  id: number;
  amount?: number;
  unit?: string;
  name_singular: JSONContent | null;
  name_singular_html: string;
  name_plural: JSONContent | null;
  name_plural_html: string;
  note?: string;
  inline_only: boolean;
};

type ServerInstructionGroup = {
  name?: string;
  instructions: ServerInstruction[];
};

export type ServerInstruction = {
  id: number;
  text: JSONContent | null;
  html: string;
  image?: ServerImage;
  inline_ingredients: InlineIngredientRelation[];
};

export type InlineIngredientRelation = {
  id: string;
  instruction_id: ServerInstruction | number;
  ingredient_id: ServerIngredient | number;
};

export type ServerImage = {
  id: string;
  title: string;
  height: number;
  width: number;
  modified_on: string;
};
