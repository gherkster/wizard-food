import customMessages from "../../i18n/custom-messages";
import type { Editor } from "@tiptap/core";
import { RelationBlockAttrs } from "../../types/relation-nodes";
import { Tool } from "../types";
import { tagName } from "../../nodes/inline-relation";

export default {
  // Custom
  key: tagName,
  name: customMessages.tools.relation_block,
  icon: "add",
  excludeFromOptions: true,
  excludeFromToolbar: true,
  // Already imported
  extension: [],
  action: (editor: Editor, attrs: RelationBlockAttrs) => {
    editor.chain().focus().setRelationBlock(attrs).run();

    // We need this workaround to prevent selecting the relation block after inserting it, if the editor content was empty (https://github.com/ueberdosis/tiptap/issues/3355)
    if (!editor.view.state.selection.empty) {
      editor
        .chain()
        .focus(editor.view.state.selection.to)
        // .insertContent({ type: "paragraph" }).focus()
        .run();
    }
  },
  disabled: (editor: Editor) => !editor.can().chain().focus().setRelationBlock().run(),
  active: (editor: Editor) => editor.isActive(tagName),
} as Tool;
