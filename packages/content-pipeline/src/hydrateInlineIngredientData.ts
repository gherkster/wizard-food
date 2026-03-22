import type { InlineIngredient, RichTextContent } from "@wizard/content/shared";

export const hydrateInlineIngredientData = (
  content: RichTextContent,
  getInlineIngredient: (id: string) => InlineIngredient | undefined,
): RichTextContent => {
  if (content.type === "inline-ingredient" && content.attrs?.id) {
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
