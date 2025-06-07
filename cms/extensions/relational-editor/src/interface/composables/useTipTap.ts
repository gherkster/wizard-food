import { Editor, mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import InlineRelation from "../../interface/components/InlineRelation.vue";
import {
  RelationBlockAttrs,
  type EditorDefaultAttributes,
} from "../../../../../../common/types/relations";
import type { InlineRelationTool } from "../../common/types/tools";
import customMessages from "../i18n/custom-messages";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    anything: {
      setRelationBlock: (attrs: RelationBlockAttrs) => ReturnType;
    };
  }
}

export function useTipTap() {
  function createInlineNode(inlineTagName: string) {
    return Node.create({
      name: inlineTagName,
      group: "inline",
      inline: true,
      draggable: true,
      selectable: true,
      atom: true,

      addAttributes() {
        return {
          id: {
            default: null,
          },
          junction: {
            default: null,
          },
          collection: {
            default: null,
          },
        } satisfies EditorDefaultAttributes<RelationBlockAttrs>;
      },

      parseHTML() {
        return [{ tag: inlineTagName }];
      },

      renderHTML({ HTMLAttributes }) {
        return [inlineTagName, mergeAttributes(HTMLAttributes)];
      },

      renderText({ node }) {
        return `[${node.attrs.collection}]\n`;
      },

      addNodeView() {
        return VueNodeViewRenderer(InlineRelation);
      },

      addCommands() {
        return {
          setRelationBlock:
            (attrs) =>
            ({ commands }) => {
              return commands.insertContent({ type: inlineTagName, attrs });
            },
        };
      },
    });
  }

  const createInlineNodeTool = (inlineTagName: string): InlineRelationTool => {
    return {
      // Custom
      key: inlineTagName,
      name: customMessages.tools.relation_block,
      icon: "add",
      excludeFromOptions: true,
      excludeFromToolbar: true,
      // Already imported
      extension: [],
      action: (editor: Editor, attrs: RelationBlockAttrs) => {
        editor.chain().focus().setRelationBlock(attrs).run();

        // We need this workaround to prevent selecting the relation block after inserting it,
        // if the editor content was empty (https://github.com/ueberdosis/tiptap/issues/3355)
        if (!editor.view.state.selection.empty) {
          editor
            .chain()
            .focus(editor.view.state.selection.to)
            // .insertContent({ type: "paragraph" }).focus()
            .run();
        }
      },
      disabled: (editor: Editor) =>
        !editor
          .can()
          .chain()
          .focus()
          // Pass in any object as .can() does not actually execute the function
          .setRelationBlock({ id: "", collection: "", junction: "" })
          .run(),
      active: (editor: Editor) => editor.isActive(inlineTagName),
    };
  };

  return {
    createInlineNode,
    createInlineNodeTool,
  };
}
