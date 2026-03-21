import { generateText } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";
import { recipeRenderExtensions } from "./extensions";
import type { RichTextContent } from "../shared/index";

export const renderRichTextHtml = (content: RichTextContent) =>
  generateHTML(content, recipeRenderExtensions);

export const renderRichTextText = (content: RichTextContent) =>
  generateText(content, recipeRenderExtensions);
