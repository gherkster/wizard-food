// https://tiptap.dev/api/nodes/heading

import Heading from "@tiptap/extension-heading";
import customMessages from "../../i18n/custom-messages";
import type { Level, HeadingOptions } from "@tiptap/extension-heading";
import type { Editor, AnyExtension } from "@tiptap/core";
import { ToolSelection } from "../../../common/types/relation-nodes";
import { Tool } from "../../../common/types/tools";

export default (level: Level): Tool => {
  const headingKeys = ["h1", "h2", "h3", "h4", "h5", "h6"];
  const headingExtension = (selection: ToolSelection): AnyExtension => {
    const levels = headingKeys
      .filter((key) => selection.indexOf(key) >= 0)
      .map((key) => headingKeys.indexOf(key) + 1);
    return Heading.configure({
      levels,
    } as HeadingOptions);
  };
  const msgKey = `h${level}` as keyof typeof customMessages.tools;

  return {
    key: `h${level}`,
    name: customMessages.tools[msgKey],
    display: `H${level}`,
    extension: [headingExtension],
    isFormatTool: true,
    shortcut: ["meta", "alt", level.toString()],
    action: (editor: Editor) => editor.chain().focus().toggleHeading({ level }).run(),
    disabled: (editor: Editor) => !editor.can().chain().focus().toggleHeading({ level }).run(),
    active: (editor: Editor) => editor.isActive("heading", { level }),
  };
};
