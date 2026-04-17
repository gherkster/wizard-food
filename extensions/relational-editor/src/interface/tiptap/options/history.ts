// https://tiptap.dev/api/extensions/history

import History from "@tiptap/extension-history";
import type { Editor } from "@tiptap/core";

import { Tool } from "../../../common/types/tools";

const undo: Tool = {
  key: "undo",
  name: "Undo",
  icon: "undo",
  extension: [History],
  shortcut: ["meta", "Z"],
  action: (editor: Editor) => editor.chain().focus().undo().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().undo().run(),
  active: () => false,
};

const redo: Tool = {
  key: "redo",
  name: "Redo",
  icon: "redo",
  extension: [History],
  shortcut: ["meta", "shift", "Z"],
  action: (editor: Editor) => editor.chain().focus().redo().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().redo().run(),
  active: () => false,
};

export default { undo, redo };
