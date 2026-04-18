// https://tiptap.dev/api/marks/bold

import type { Editor } from "@tiptap/core";
import Bold from "@tiptap/extension-bold";

import { type Tool } from "../../../common/types/tools";
import { extendMarkRangeIfUnselected } from "../util";

export default {
  key: "bold",
  name: "Bold",
  icon: "format_bold",
  extension: [Bold],
  shortcut: ["meta", "B"],
  action: (editor: Editor) => extendMarkRangeIfUnselected(editor, "bold").toggleBold().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().toggleBold().run(),
  active: (editor: Editor) => editor.isActive("bold"),
} as Tool;
