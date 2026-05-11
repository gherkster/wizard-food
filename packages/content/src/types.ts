import type { InlineIngredientHTMLElementDataset, SingularPluralPair } from "./recipe";

export type ImagePurpose = "cover" | "preview";

export type ImageVariant = {
  src: string;
  srcSet: string;
  sizes: string;
};

export type ImageVariants = Record<ImagePurpose, ImageVariant>;

export type Image = {
  /** The optional base64 encoded thumbnail image URL. */
  base64ThumbnailUrl?: string;
  /** The height of the image in pixels. */
  height: number;
  /** The time the image was last modified, for cache busting purposes. */
  modifiedOn: string;
  /** The sizes of the image. */
  sizes: string;
  /** The src of the image. */
  src: string;
  /** The srcSet of the image. */
  srcSet: string;
  /** The title of the image, for alt text. */
  title: string;
  /** The width of the image in pixels. */
  width: number;
};

export type Recipe = {
  /** The recipe course. @example "Mains" */
  course: string;
  /** The large cover image of the recipe. */
  coverImage: Image;
  /** The recipe cuisine. @example "German" */
  cuisine: string;
  /** The date the recipe was published. */
  datePublished: string | undefined;
  /** The description of the recipe. @format html */
  description: string;
  /** The plaintext description of the recipe. */
  descriptionPlainText: string;
  /** The plaintext description snippet. */
  descriptionSnippet: string;
  /** The diets applicable to this recipe. @example ["Vegetarian", "Vegan"] */
  diets: string[] | undefined;
  durationTotal: RecipeDuration | undefined;
  durationComponents: RecipeDuration[];
  /** Whether the recipe is a favourite recipe. */
  favourite: boolean | undefined;
  /** The featured tag of the recipe metadata. */
  featuredTag: string | undefined;
  /** The recipe ingredient groups. */
  ingredientGroups: IngredientGroup[];
  /** The recipe instruction groups. */
  instructionGroups: InstructionGroup[];
  /** The main ingredients of the recipe. @example ["Beef"] */
  mainIngredients: string[] | undefined;
  /** The recipe notes. @format html */
  note: string | undefined;
  /** The small preview image of the recipe. */
  previewImage: Image;
  /** The number of recipe servings. */
  servings: number;
  /** The type of recipe servings. @example { singular: "Slice", plural: "Slices" } */
  servingsType: SingularPluralPair;
  /** The unique URL slug of the recipe. */
  slug: string;
  /** The title of the recipe. */
  title: string;
};

export type RecipePreview = Pick<
  Recipe,
  | "course"
  | "cuisine"
  | "diets"
  | "durationTotal"
  | "featuredTag"
  | "previewImage"
  | "slug"
  | "title"
>;

export type RecipeDuration = {
  /** The ISO 8601 duration. @example "PT1H15M" */
  isoDuration: string;
  /** The label of the recipe duration. @example "Preparation" */
  label: string;
  /** The total number of minutes in the duration. */
  minutes: number;
  /** The text of the recipe duration. @example "1h 20m" */
  text: string;
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

export type InstructionGroup = {
  name?: string;
  instructions: Array<Instruction>;
};

export type Instruction = {
  text: string;
};
