import { Editor, mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import InlineRelation from "../components/InlineRelation.vue";
import { RelationBlockAttrs } from "../../../../../../common/types/relations";
import { Tool } from "../tiptap/types";
import customMessages from "../i18n/custom-messages";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    anything: {
      setRelationBlock: (attrs?: RelationBlockAttrs) => ReturnType;
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
        };
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
            (
              attrs = {
                id: null,
                junction: null,
                collection: null,
              },
            ) =>
            ({ commands }) => {
              return commands.insertContent({ type: inlineTagName, attrs });
            },
        };
      },
    });
  }

  function createInlineNodeTool(inlineTagName: string) {
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
      disabled: (editor: Editor) => !editor.can().chain().focus().setRelationBlock().run(),
      active: (editor: Editor) => editor.isActive(inlineTagName),
    } as Tool;
  }

  return {
    createInlineNode,
    createInlineNodeTool,
  };
}
