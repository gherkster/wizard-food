export type Recipe = {
  title: string;
  description: string;
  descriptionPlainText: string;
  descriptionSnippet: string;
  cuisine?: string;
  course?: string;
  note?: string;
  coverImage: Image;
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
};

export type RecipePreview = {
  title: string;
  descriptionSnippet: string;
  coverImage: Image;
  cuisine?: string;
  course?: string;
  tags: string[];
  featuredTag?: string;
  preparationDuration?: number;
  cookingDuration?: number;
  customDurationName?: string;
  customDuration?: number;
  totalDuration?: string;
  slug: string;
  date_created: string;
  favourite?: boolean;
};

export type IngredientGroup = {
  name?: string;
  ingredients: Ingredient[];
};

export type Ingredient = {
  amount?: number;
  unit?: string;
  name: {
    singular: string;
    plural: string;
  };
  note?: string;
  inlineOnly?: boolean;
};

export type Image = {
  id: string;
  title: string;
  height: number;
  width: number;
  modifyDate: string;
};

export type InstructionGroup = {
  name?: string;
  instructions: Array<Instruction>;
};

export type Instruction = {
  text: string;
  image?: Image;
};
