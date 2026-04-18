// https://tiptap.dev/api/nodes/ordered-list

import type { Editor } from "@tiptap/core";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";

import { type Tool } from "../../../common/types/tools";

export default {
  key: "orderedList",
  name: "Ordered list",
  icon: "format_list_numbered",
  extension: [OrderedList, ListItem],
  shortcut: ["meta", "shift", "7"],
  action: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().toggleOrderedList().run(),
  active: (editor: Editor) => editor.isActive("orderedList"),
} as Tool;
