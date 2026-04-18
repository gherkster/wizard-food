// https://tiptap.dev/api/marks/strike

import type { Editor } from "@tiptap/core";
import Strike from "@tiptap/extension-strike";

import { type Tool } from "../../../common/types/tools";
import { extendMarkRangeIfUnselected } from "../util";

export default {
  key: "strike",
  name: "Strikethrough",
  icon: "format_strikethrough",
  extension: [Strike],
  shortcut: ["meta", "shift", "X"],
  action: (editor: Editor) => extendMarkRangeIfUnselected(editor, "strike").toggleStrike().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().toggleStrike().run(),
  active: (editor: Editor) => editor.isActive("strike"),
} as Tool;
