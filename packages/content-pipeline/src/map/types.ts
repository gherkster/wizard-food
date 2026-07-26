import type { Image, IngredientGroup, RecipeDuration, SingularPluralPair } from "@wizard/content";

export type HydratedInstruction = {
  html: string;
  plainText: string;
};

export type HydratedInstructionGroup = {
  name?: string;
  instructions: HydratedInstruction[];
};

export type HydratedRecipe = {
  cuisine: string;
  course: string;
  coverImage: Image;
  datePublished: string | undefined;
  descriptionHtml: string;
  descriptionPlainText: string;
  descriptionSnippet: string;
  diets: string[] | undefined;
  durationComponents: RecipeDuration[];
  durationTotal: RecipeDuration | undefined;
  favourite: boolean | undefined;
  featuredTag: string | undefined;
  ingredientGroups: IngredientGroup[];
  instructionGroups: HydratedInstructionGroup[];
  mainIngredients: string[] | undefined;
  note: string | undefined;
  previewImage: Image;
  servings: number;
  servingsType: SingularPluralPair;
  slug: string;
  title: string;
};
