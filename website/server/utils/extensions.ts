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
import Fraction from "fraction.js";
import { formatIngredient } from "../../shared/utils/formatting";
import type { InlineIngredient, InlineIngredientHTMLElementDataset } from "~~/shared/types/recipe";
import type { KebabCaseDataAttributes } from "~~/shared/types/casing";

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

type InlineIngredientAttributes = {
  collection: string;
  data?: InlineIngredient;
};

const inlineIngredientSerializer = Node.create({
  name: "inline-ingredient",
  // Include the editor attributes, so that the below renderHTML call can check the collection and data properties
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
  renderHTML(props) {
    // Cast type since tiptap uses any here
    const htmlAttributes = props.HTMLAttributes as InlineIngredientAttributes;

    if (htmlAttributes.collection === "ingredients" && htmlAttributes.data) {
      // Data attributes have to be specified in tiptap extensions using HTML format (kebab case)
      const inlineIngredientAttributes: KebabCaseDataAttributes<InlineIngredientHTMLElementDataset> =
        {
          "data-ingredient": JSON.stringify(htmlAttributes.data),
        };

      /*
        This is only relevant on page load before the component starts creating the name based on data attributes
        So we can assume if an amount is specified <= 1 that it should show the singular form,
        since on page load the servings multiplier is in the default state
      */
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

extensions.push(inlineIngredientSerializer);

export default extensions;
