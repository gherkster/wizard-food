import { mergeAttributes, Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import InlineRelation from "../components/InlineRelation.vue";
import { RelationBlockAttrs } from "../types/relation-nodes";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    [tagName]: {
      setRelationBlock: (attrs?: RelationBlockAttrs) => ReturnType;
    };
  }
}

export const tagName = "inline-relation";

export default Node.create({
  name: tagName,
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
    return [{ tag: tagName }];
  },

  renderHTML({ HTMLAttributes }) {
    return [tagName, mergeAttributes(HTMLAttributes)];
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
          return commands.insertContent({ type: tagName, attrs });
        },
    };
  },
});
