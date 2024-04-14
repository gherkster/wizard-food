import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import CodeBlock from "@tiptap/extension-code-block";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import { Table } from "@tiptap/extension-table";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { Node } from "@tiptap/core";
import { useRecipeFormatter } from "~/composables";
import type { ServerIngredient } from "common/types/serverRecipe";

interface InlineIngredientAttributes {
  collection: string;
  data?: ServerIngredient;
}

const inlineIngredientSerializer = Node.create({
  name: "inline-relation",
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
      data: {
        default: null,
      },
    };
  },
  renderHTML({ node, HTMLAttributes }: { node: Node; HTMLAttributes: InlineIngredientAttributes }) {
    const recipeFormatter = useRecipeFormatter();
    if (HTMLAttributes.collection === "ingredients" && HTMLAttributes.data) {
      return [
        "span",
        {
          class: "inline-ingredient",
          "data-amount": HTMLAttributes.data?.amount,
          "data-unit": HTMLAttributes.data?.unit,
          "data-name": HTMLAttributes.data?.name,
          "data-note": HTMLAttributes.data?.note,
        },
        recipeFormatter.formatIngredient(HTMLAttributes.data),
      ];
    }

    return [node.type, HTMLAttributes, 0];
  },
});

export default [
  Document,
  Text,
  Paragraph,
  HardBreak,
  Heading,
  CodeBlock,
  BulletList,
  OrderedList,
  ListItem,
  Blockquote,
  HorizontalRule,
  Link,
  Bold,
  Italic,
  Strike,
  Code,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  inlineIngredientSerializer,
];
