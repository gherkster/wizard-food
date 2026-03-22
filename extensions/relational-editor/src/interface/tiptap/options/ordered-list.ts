// https://tiptap.dev/api/nodes/ordered-list

import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import type { Editor } from "@tiptap/core";

import customMessages from "../../i18n/custom-messages";
import { Tool } from "../../../common/types/tools";

export default {
  key: "orderedList",
  name: customMessages.tools.ordered_list,
  icon: "format_list_numbered",
  extension: [OrderedList, ListItem],
  shortcut: ["meta", "shift", "7"],
  action: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().toggleOrderedList().run(),
  active: (editor: Editor) => editor.isActive("orderedList"),
} as Tool;
