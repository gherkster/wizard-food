// https://tiptap.dev/api/nodes/blockquote

import Blockquote from "@tiptap/extension-blockquote";
import type { Editor } from "@tiptap/core";

import { Tool } from "../../../common/types/tools";

export default {
  key: "blockquote",
  name: "Block quote",
  icon: "format_quote",
  extension: [Blockquote],
  shortcut: ["meta", "shift", "B"],
  action: (editor: Editor) => editor.chain().focus().toggleBlockquote().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().toggleBlockquote().run(),
  active: (editor: Editor) => editor.isActive("blockquote"),
} as Tool;
