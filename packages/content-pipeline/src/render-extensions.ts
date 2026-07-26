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
import Text from "@tiptap/extension-text";
import type {
  EditorDefaultAttributes,
  InlineIngredient,
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
      return [
        "span",
        {
          class: "inline-ingredient",
          "data-ingredient": JSON.stringify(htmlAttributes.data),
        },
        formatInlineIngredient(htmlAttributes.data),
      ];
    }

    return [props.node.type.name, htmlAttributes];
  },
  renderText(props) {
    const attrs = props.node.attrs as InlineIngredientAttributes;

    if (attrs.collection === "ingredients" && attrs.data) {
      return formatInlineIngredient(attrs.data);
    }

    return "";
  },
});

const formatInlineIngredient = (data: InlineIngredient) => {
  const isSingularForm = data.amount !== undefined && Number(data.amount) <= 1;

  return formatIngredient({
    amount: data.amount !== undefined ? new Fraction(data.amount) : undefined,
    unit: isSingularForm ? data.unit?.singular : data.unit?.plural,
    name: isSingularForm ? data.name.singular : data.name.plural,
  });
};

recipeRenderExtensions.push(inlineIngredientSerializer);
