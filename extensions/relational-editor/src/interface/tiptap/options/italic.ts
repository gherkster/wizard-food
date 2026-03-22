// https://tiptap.dev/api/marks/italic

import Italic from "@tiptap/extension-italic";
import type { Editor } from "@tiptap/core";

import { extendMarkRangeIfUnselected } from "../util";
import customMessages from "../../i18n/custom-messages";
import { Tool } from "../../../common/types/tools";

export default {
  key: "italic",
  name: customMessages.tools.italic,
  icon: "format_italic",
  extension: [Italic],
  shortcut: ["meta", "I"],
  action: (editor: Editor) => extendMarkRangeIfUnselected(editor, "italic").toggleItalic().run(),
  disabled: (editor) => !editor.can().chain().focus().toggleItalic().run(),
  active: (editor: Editor) => editor.isActive("italic"),
} as Tool;
