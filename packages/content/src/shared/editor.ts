import type { JSONContent } from "@tiptap/core";
import type { InlineIngredient } from "./recipe";

export type RichTextContent = JSONContent;

export type JSONRecipeIngredientAttributes = Record<string, unknown> & {
  data: InlineIngredient;
};

export type JSONRecipeIngredientContent = JSONContent & {
  attrs: JSONRecipeIngredientAttributes;
};
