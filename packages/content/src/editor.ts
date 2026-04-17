import { InlineIngredient } from "./recipe";

export type JSONContent = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: JSONContent[];
  marks?: {
    [key: string]: unknown;
    type: string;
    attrs?: Record<string, unknown> | undefined;
  }[];
  text?: string;
  [key: string]: unknown;
};

export type RichTextContent = JSONContent;

export type JSONRecipeIngredientAttributes = Record<string, unknown> & {
  data: InlineIngredient;
};

export type JSONRecipeIngredientContent = JSONContent & {
  attrs: JSONRecipeIngredientAttributes;
};
