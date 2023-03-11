export interface Recipe {
  id: number;
  title: string;
  note: string;
  ingredientGroups: Array<IngredientGroup>;
  instructionGroups: Array<InstructionGroup>;
  category: string;
  cuisine: string;
  rating: number;
  servings: number;
  preparationDuration: RecipeDuration;
  cookingDuration: RecipeDuration;
  customDurations: Array<RecipeDuration>;
  tags: Array<string>;
  slug: string;
}

interface IngredientGroup {
  name: string | null;
  ingredients: Array<Ingredient>;
}

interface Ingredient {
  amount: IngredientFraction | null;
  unit: string;
  name: string;
  note: string;
}

export interface IngredientFraction {
  numerator: number;
  denominator: number;
}

interface InstructionGroup {
  name: string | null;
  instructions: Array<Instruction>;
}

interface Instruction {
  label: string;
}

export interface RecipeDuration {
  minutes: number;
  hours: number;
  days: number;
  name: string;
}
