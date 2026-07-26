import { generateText } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";
import type { RichTextContent } from "@wizard/content";

import { recipeRenderExtensions } from "./render-extensions";

export const renderRichTextHtml = (content: RichTextContent) =>
  generateHTML(content, recipeRenderExtensions);

export const renderPlainText = (content: RichTextContent) =>
  generateText(content, recipeRenderExtensions, {
    blockSeparator: "", // Defaults to "\n\n", but we are calling this for inline text
  });
