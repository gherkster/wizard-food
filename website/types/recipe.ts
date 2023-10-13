import Fraction from "fraction.js";

export interface Recipe {
  title: string;
  note?: string;
  coverImage?: Image;
  ingredientGroups: IngredientGroup[];
  instructionGroups: InstructionGroup[];
  category: string;
  cuisine: string;
  servings?: number;
  preparationDuration?: number;
  cookingDuration?: number;
  customDurationName?: string;
  customDuration?: number;
  tags: string[];
  slug: string;
}

export interface IngredientGroup {
  name?: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  amount?: Fraction;
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
  label: string;
  image?: Image;
}
