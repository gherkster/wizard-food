import type { RichTextContent } from "@wizard/content/shared";
import { generateHTML } from "@tiptap/html";
import { generateText } from "@tiptap/core";

import { recipeRenderExtensions } from "./render-extensions";

export const renderRichTextHtml = (content: RichTextContent) =>
  generateHTML(content, recipeRenderExtensions);

export const renderRichTextText = (content: RichTextContent) =>
  generateText(content, recipeRenderExtensions);
