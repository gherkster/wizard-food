import type { JSONContent } from "@tiptap/core";

export interface ServerRecipe extends ServerRecipeCategories {
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
}

export interface ServerRecipePreview extends ServerRecipeCategories {
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
}

export interface ServerRecipeCategories {
  cuisine?: string;
  course?: string;
  main_ingredients?: string[];
  diets?: string[];
  method?: string;
}

interface ServerIngredientGroup {
  name?: string;
  ingredients: ServerIngredient[];
}

export interface ServerIngredient {
  id: number;
  amount?: number;
  unit?: string;
  name_singular: JSONContent | null;
  name_singular_html: string;
  name_plural: JSONContent | null;
  name_plural_html: string;
  note?: string;
  inline_only: boolean;
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

export interface ServerImage {
  id: string;
  title: string;
  height: number;
  width: number;
  modified_on: string;
}
