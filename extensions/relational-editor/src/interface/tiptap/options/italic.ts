// https://tiptap.dev/api/marks/italic

import type { Editor } from "@tiptap/core";
import Italic from "@tiptap/extension-italic";

import { type Tool } from "../../../common/types/tools";
import { extendMarkRangeIfUnselected } from "../util";

export default {
  key: "italic",
  name: "Italic",
  icon: "format_italic",
  extension: [Italic],
  shortcut: ["meta", "I"],
  action: (editor: Editor) => extendMarkRangeIfUnselected(editor, "italic").toggleItalic().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().toggleItalic().run(),
  active: (editor: Editor) => editor.isActive("italic"),
} as Tool;
