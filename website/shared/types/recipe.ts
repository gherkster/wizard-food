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
  main_ingredients?: unknown;
  favourite?: boolean;
  method?: string;
  tags: string[];
  featuredTag?: string;
  slug: string;
  datePublished?: string;
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
  datePublished?: Date;
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
  datePublished?: Date;
  favourite?: boolean;
};

/** The minimal fields that are stored inside the recipe search index. */
export type SearchIndexRecipe = {
  title: string;
  coverImage: {
    id: string;
    fileName: string;
    height: number;
    width: number;
    modifyDate: string;

    // Assign to never so these properties are not accidentally included in the search index, as they are not needed and bloat the size of the client side index
    title?: never;
    metadata?: never;
  };
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
  /**
   * The singular and plural forms of an ingredient unit
   * @example { singular: "clove", plural: "cloves" }
   */
  unit?: SingularPluralPair;

  /**
   * The rich text singular and plural forms of an ingredient name
   * @example { singular: "<p>chicken thigh</p>", plural: "<p>chicken thighs</p>" }
   */
  name: SingularPluralPair;
  note?: string;
  inlineOnly?: boolean;
};

export type SingularPluralPair = {
  singular: string;
  plural: string;
};

export type InlineIngredient = {
  amount?: number;
  /**
   * The singular and plural forms of an ingredient unit
   * @example { singular: "clove", plural: "cloves" }
   */
  unit?: SingularPluralPair;

  /**
   * The plain text singular and plural forms of an ingredient name
   * @example { singular: "chicken thigh", plural: "chicken thighs" }
   */
  name: SingularPluralPair;
};

/** The HTML dataset attributes of an inline ingredient HTML element */
export interface InlineIngredientHTMLElementDataset extends DOMStringMap {
  /**
   * The JSON content of an inline ingredient
   * @see {@link InlineIngredient}
   */
  ingredient: string;
}

/** The structure of an inline ingredient HTML element */
export interface InlineIngredientHTMLElement extends HTMLSpanElement {
  dataset: InlineIngredientHTMLElementDataset;
}

export type Image = {
  /** The ID of the image */
  id: string;
  /** The image title or alt text */
  title: string;
  /** The file name, excluding the file extension */
  fileName: string;
  /** The height in pixels of the image */
  height: number;
  /** The width in pixels of the image */
  width: number;
  /** The modify date of the image for cache busting purposes */
  modifyDate: string;
  metadata?: {
    /** The base64 encoded thumbnail of this image */
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
