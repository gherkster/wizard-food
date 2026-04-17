// https://tiptap.dev/api/nodes/horizontal-rule

import HorizontalRule from "@tiptap/extension-horizontal-rule";
import type { Editor } from "@tiptap/core";

import { Tool } from "../../../common/types/tools";

export default {
  key: "horizontalRule",
  name: "Horizontal rule",
  icon: "horizontal_rule",
  extension: [HorizontalRule],
  shortcut: [],
  disabledInSingleLineMode: true,
  action: (editor: Editor) => editor.chain().focus().setHorizontalRule().run(),
  disabled: (editor: Editor) => !editor.can().chain().focus().setHorizontalRule().run(),
  active: () => false,
} as Tool;
