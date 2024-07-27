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
import { generateText } from "@tiptap/core";
import { useRecipeFormatter } from "~/composables";
import type { ServerIngredient } from "common/types/serverRecipe";
import Fraction from "fraction.js";

interface InlineIngredientAttributes {
  collection: string;
  data?: ServerIngredient;
}

const extensions = [
  Document,
  Text,
  Paragraph.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        text: {
          renderHTML: () => {
            return {
              class: "rich-text",
            };
          },
        },
      };
    },
  }),
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
];

const inlineIngredientSerializer = Node.create({
  name: "inline-ingredient",
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
          "data-amount": HTMLAttributes.data.amount,
          "data-unit": HTMLAttributes.data.unit,
          "data-name-singular": generateText(HTMLAttributes.data.name_singular ?? {}, extensions),
          "data-name-plural": generateText(HTMLAttributes.data.name_plural ?? {}, extensions),
          "data-note": HTMLAttributes.data.note,
        },
        recipeFormatter.formatIngredient({
          amount: HTMLAttributes.data.amount ? new Fraction(HTMLAttributes.data.amount) : undefined,
          unit: HTMLAttributes.data.unit,
          /*
            This is only relevant on page load before the component starts creating the name based on data attributes
            So we can assume if an amount is specified <= 1 that it should show the singular form,
            since on page load the servings multiplier is in the default state
          */
          name: generateText(
            HTMLAttributes.data.amount && HTMLAttributes.data.amount <= 1
              ? HTMLAttributes.data.name_singular ?? {}
              : HTMLAttributes.data.name_plural ?? {},
            extensions,
          ),
        }),
      ];
    }

    return [node.type, HTMLAttributes, 0];
  },
});

extensions.push(inlineIngredientSerializer);

export default extensions;
