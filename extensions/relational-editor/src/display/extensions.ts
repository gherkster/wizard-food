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

import { useTipTap } from "../interface/composables/useTipTap";
import inlineNodeTagNames from "../common/inlineNodeTagNames";

const extensions = [
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
];

const tipTap = useTipTap();
inlineNodeTagNames.forEach((tag) => {
  extensions.push(tipTap.createInlineNode(tag.value));
});

export default extensions;
