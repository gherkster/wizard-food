import { Node } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import Text from "@tiptap/extension-text";
import type {
  EditorDefaultAttributes,
  InlineIngredient,
  InlineIngredientHTMLElementDataset,
  KebabCaseDataAttributes,
  RelationBlockAttrs,
} from "@wizard/content";
import { formatIngredient } from "@wizard/content";
import Fraction from "fraction.js";

export const recipeRenderExtensions = [
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

type InlineIngredientAttributes = RelationBlockAttrs & {
  data?: InlineIngredient;
};

export const inlineIngredientSerializer = Node.create({
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
    } satisfies EditorDefaultAttributes<InlineIngredientAttributes>;
  },
  renderHTML(props) {
    const htmlAttributes = props.HTMLAttributes as InlineIngredientAttributes;

    if (htmlAttributes.collection === "ingredients" && htmlAttributes.data) {
      const inlineIngredientAttributes: KebabCaseDataAttributes<InlineIngredientHTMLElementDataset> =
        {
          "data-ingredient": JSON.stringify(htmlAttributes.data),
        };

      const isSingularForm =
        htmlAttributes.data.amount !== undefined && Number(htmlAttributes.data.amount) <= 1;

      return [
        "span",
        {
          class: "inline-ingredient",
          ...inlineIngredientAttributes,
        },
        formatIngredient({
          amount:
            htmlAttributes.data.amount !== undefined
              ? new Fraction(htmlAttributes.data.amount)
              : undefined,
          unit: isSingularForm
            ? htmlAttributes.data.unit?.singular
            : htmlAttributes.data.unit?.plural,
          name: isSingularForm
            ? htmlAttributes.data.name.singular
            : htmlAttributes.data.name.plural,
        }),
      ];
    }

    return [props.node.type.name, htmlAttributes];
  },
});

recipeRenderExtensions.push(inlineIngredientSerializer);
