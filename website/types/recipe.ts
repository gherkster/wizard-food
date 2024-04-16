import type { JSONContent } from "@tiptap/core";

export interface Recipe {
  title: string;
  description?: string;
  note?: string;
  coverImage?: Image;
  ingredientGroups: IngredientGroup[];
  instructionGroups: InstructionGroup[];
  servings?: number;
  servingsType?: string;
  preparationDuration?: number;
  cookingDuration?: number;
  customDurationName?: string;
  customDuration?: number;
  tags: string[];
  slug: string;
}

export interface RecipePreview {
  title: string;
  featuredTag?: string;
  totalDuration?: string;
  coverImage?: Image;
  slug: string;
}

export interface IngredientGroup {
  name?: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  amount?: number;
  unit?: string;
  name: string;
  note?: string;
}

export interface Image {
  id: string;
  title: string;
  height: number;
  width: number;
  modifyDate: string;
}

export interface InstructionGroup {
  name?: string;
  instructions: Array<Instruction>;
}

export interface Instruction {
  text: string;
  content: JSONContent | null;
  image?: Image;
}
