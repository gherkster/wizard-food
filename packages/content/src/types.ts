import type { InlineIngredientHTMLElementDataset, SingularPluralPair } from "./recipe";

export type ImagePurpose = "cover" | "preview" | "instruction";
export type ImageShape = "square" | "portrait";

export type ImageVariant = {
  src: string;
  srcSet: string;
  sizes: string;
};

export type ImageVariants = Record<ImagePurpose, Record<ImageShape, ImageVariant>>;

export type AspectRatio = {
  x: number;
  y: number;
};

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
  servings: number;
  servingsType: SingularPluralPair;
  preparationDuration?: number;
  cookingDuration?: number;
  customDurationName?: string;
  customDuration?: number;
  diets?: string[];
  main_ingredients?: string[];
  favourite?: boolean;
  method?: string;
  tags: string[];
  featuredTag?: string;
  slug: string;
  datePublished?: string;
};

export type RecipePreview = {
  title: string;
  descriptionSnippet: string;
  coverImage: Image;
  cuisine?: string;
  course?: string;
  diets?: string[];
  main_ingredients?: string[];
  method?: string;
  tags: string[];
  featuredTag?: string;
  preparationDuration?: number;
  cookingDuration?: number;
  customDurationName?: string;
  customDuration?: number;
  totalDurationLabel?: string;
  slug: string;
  datePublished?: string;
  favourite?: boolean;
};

export type FeaturedRecipes = {
  latestRecipes: RecipePreview[];
  favouriteRecipes: RecipePreview[];
  quickRecipes: RecipePreview[];
  worldCuisineRecipes: RecipePreview[];
};

export type WebsitePageContent = {
  title: string;
  description: string;
  openGraphDescription: string;
};

export type WebsitePagesContent = {
  home: WebsitePageContent;
  recipes: WebsitePageContent;
};

export type ContentMeta = {
  build: string;
  generatedAt: string;
};

export type IngredientGroup = {
  name?: string;
  ingredients: Ingredient[];
};

export type Ingredient = {
  amount?: number;
  unit?: SingularPluralPair;
  name: SingularPluralPair;
  note?: string;
  inlineOnly?: boolean;
};

export interface InlineIngredientHTMLElement extends HTMLSpanElement {
  dataset: InlineIngredientHTMLElementDataset;
}

export type Image = {
  id: string;
  title: string;
  fileName: string;
  height: number;
  width: number;
  modifyDate: string;
  variants: ImageVariants;
  metadata?: {
    base64Url: string;
  };
};

export type InstructionGroup = {
  name?: string;
  instructions: Array<Instruction>;
};

export type Instruction = {
  text: string;
  image?: Image;
};
