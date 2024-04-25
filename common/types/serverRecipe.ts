import { JSONContent } from "@tiptap/core";

export interface ServerRecipe {
  id: number;
  title: string;
  description?: JSONContent | null;
  description_html?: string;
  note?: JSONContent | null;
  note_html?: string;
  coverImage?: ServerImage;
  cuisine?: string;
  course?: string;
  main_ingredients?: string[];
  diets?: string[];
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
}

interface ServerIngredientGroup {
  name?: string;
  ingredients: ServerIngredient[];
}

export interface ServerIngredient {
  id: number;
  unit?: string;
  name: JSONContent | null;
  name_html: string;
  note?: string;
  amount?: number;
}

interface ServerInstructionGroup {
  name?: string;
  instructions: ServerInstruction[];
}

export interface ServerInstruction {
  id: number;
  text: JSONContent | null;
  html: string;
  image?: ServerImage;
  inline_ingredients: InlineIngredientRelation[];
}

export interface InlineIngredientRelation {
  id: string;
  instruction_id: ServerInstruction | number;
  ingredient_id: ServerIngredient | number;
}

interface ServerTag {
  tags_id: ServerTagsId;
}

interface ServerTagsId {
  value: string;
}

export interface ServerImage {
  id: string;
  title: string;
  height: number;
  width: number;
  modified_on: string;
}
