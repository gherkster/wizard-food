import type { InlineIngredient, RichTextContent } from "@wizard/content";

export const hydrateInlineIngredientData = (
  content: RichTextContent,
  getInlineIngredient: (id: string) => InlineIngredient | undefined,
): RichTextContent => {
  if (
    content.type === "inline-ingredient" &&
    content.attrs?.id !== undefined &&
    content.attrs.id !== null &&
    (typeof content.attrs.id === "string" || typeof content.attrs.id === "number")
  ) {
    const id = String(content.attrs.id);
    const inlineIngredient = getInlineIngredient(id);

    if (inlineIngredient) {
      const attrs = (content.attrs ?? {}) as Record<string, unknown>;
      attrs.data = inlineIngredient;
      content.attrs = attrs;
    }
  }

  content.content?.forEach((childContent) => {
    hydrateInlineIngredientData(childContent, getInlineIngredient);
  });

  return content;
};
