import type { JSONContent } from "@tiptap/core";

type JSONRecipeIngredientAttributes = Record<string, unknown> & {
  data: InlineIngredient;
};

/** Override the {@link JSONContent} type with recipe ingredient data properties */
export type JSONRecipeIngredientContent = JSONContent & { attrs: JSONRecipeIngredientAttributes };
