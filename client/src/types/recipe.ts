export interface Recipe {
  id: number;
  title: string;
  coverImage?: ImageMeta;
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

export interface IngredientGroup {
  name: string | null;
  ingredients: Array<Ingredient>;
}

export interface Ingredient {
  amount: IngredientFraction | null;
  unit: string;
  name: string;
  note: string;
}

export interface IngredientFraction {
  numerator: number;
  denominator: number;
}

export interface InstructionGroup {
  name: string | null;
  instructions: Array<Instruction>;
}

export interface Instruction {
  label: string;
}

export interface RecipeDuration {
  minutes: number;
  hours: number;
  days: number;
  name: string;
}

export interface DropdownOptions {
  categories: Array<string>;
  cuisines: Array<string>;
  customTimeTypes: Array<string>;
  tags: Array<string>;
  units: Array<string>;
}

export interface ImageMeta {
  id: string;
  displayName: string;
  aspectRatioX: number;
  aspectRatioY: number;
}
