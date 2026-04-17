// https://tiptap.dev/api/marks/italic

import Italic from "@tiptap/extension-italic";
import type { Editor } from "@tiptap/core";

import { extendMarkRangeIfUnselected } from "../util";
import { Tool } from "../../../common/types/tools";

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
