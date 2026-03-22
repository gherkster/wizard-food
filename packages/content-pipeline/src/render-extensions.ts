import Fraction from "fraction.js";
import type {
  EditorDefaultAttributes,
  InlineIngredient,
  InlineIngredientHTMLElementDataset,
  KebabCaseDataAttributes,
  RelationBlockAttrs,
} from "@wizard/content/shared";
import { formatIngredient } from "@wizard/content/shared";
import Text from "@tiptap/extension-text";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Table } from "@tiptap/extension-table";
import Strike from "@tiptap/extension-strike";
import Paragraph from "@tiptap/extension-paragraph";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import Italic from "@tiptap/extension-italic";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Heading from "@tiptap/extension-heading";
import HardBreak from "@tiptap/extension-hard-break";
import Document from "@tiptap/extension-document";
import CodeBlock from "@tiptap/extension-code-block";
import Code from "@tiptap/extension-code";
import BulletList from "@tiptap/extension-bullet-list";
import Bold from "@tiptap/extension-bold";
import Blockquote from "@tiptap/extension-blockquote";
import { Node } from "@tiptap/core";

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

      const isSingularForm = htmlAttributes.data.amount && Number(htmlAttributes.data.amount) <= 1;

      return [
        "span",
        {
          class: "inline-ingredient",
          ...inlineIngredientAttributes,
        },
        formatIngredient({
          amount: htmlAttributes.data.amount ? new Fraction(htmlAttributes.data.amount) : undefined,
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
