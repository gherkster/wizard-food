import { AnyExtension } from "@tiptap/core";
import { InterfaceOption, ToolSelection } from "../types/relation-nodes";
import heading from "./options/heading";
import history from "./options/history";
import relationBlock from "./options/inline-relation";
import paragraph from "./options/paragraph";
import codeBlock from "./options/code-block";
import bold from "./options/bold";
import italic from "./options/italic";
import strike from "./options/strike";
import code from "./options/code";
import link from "./options/link";
import hardBreak from "./options/hard-break";
import horizontalRule from "./options/horizontal-rule";
import bulletList from "./options/bullet-list";
import orderedList from "./options/ordered-list";
import blockquote from "./options/blockquote";
import table from "./options/table";
import { Tool } from "./types";
import { tagName } from "../nodes/inline-relation";

const tools: Tool[] = [
  relationBlock,
  paragraph,
  codeBlock,
  heading(1),
  heading(2),
  heading(3),
  heading(4),
  heading(5),
  heading(6),
  bold,
  italic,
  strike,
  code,
  link.add,
  link.remove,
  link.auto,
  hardBreak,
  horizontalRule,
  bulletList,
  orderedList,
  blockquote,
  table,
  history.undo,
  history.redo,
];

export const pickSelectedTools = (selection: ToolSelection): AnyExtension[] => {
  const toolsExtensions: AnyExtension[] = [];
  const uniqueNames: string[] = [];

  selectedTools(selection).forEach(({ extension }) =>
    extension.forEach((item) => {
      const extensionItem = typeof item === "function" ? item(selection) : item;
      const extensionNotExists = uniqueNames.indexOf(extensionItem.name) < 0;

      if (extensionNotExists) {
        uniqueNames.push(extensionItem.name);
        toolsExtensions.push(extensionItem);
      }
    }),
  );

  return toolsExtensions;
};

export const selectedTools = (selection: ToolSelection) => {
  return tools.filter(({ key }) => selection.indexOf(key) >= 0);
};

const optionalTools: Tool[] = tools.filter((tool) => !tool.excludeFromOptions);

export const interfaceOptions: InterfaceOption[] = optionalTools.map(({ key, name }) => ({ text: name, value: key }));

export const defaultSelectedTools: string[] = optionalTools.map(({ key }) => key);

export const relationBlockTool: Tool | undefined = tools.find(({ key }) => key === tagName);
