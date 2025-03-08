/** The shared recipe payload fields, which contains all the data that may be displayed in the client. */
export type RecipePayload = {
  id: number;
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
  diets?: unknown;
  servings_type?: string;
  main_ingredients?: unknown;
  favourite?: boolean;
  method?: string;
  tags: string[];
  featuredTag?: string;
  slug: string;
  date_published?: string;
};

/** The fields to display the full recipe view. */
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
  date_published?: Date;
};

/** The fields to display recipe preview cards. */
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
  totalDurationLabel?: string;
  slug: string;
  date_published?: Date;
  favourite?: boolean;
};

/** The minimal fields that are stored inside the recipe search index. */
export type SearchIndexRecipe = {
  title: string;
  coverImage: Image;
  slug: string;
  tags: string[];
  featuredTag?: string;
  totalDurationLabel?: string;
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
