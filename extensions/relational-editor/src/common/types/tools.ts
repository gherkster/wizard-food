import { type AnyExtension, type Editor } from "@tiptap/core";
import { type RelationBlockAttrs } from "@wizard/content";
import { type Component } from "vue";

import { type ToolSelection } from "./relation-nodes";

export type Tool<TAttrs = undefined> = {
  key: string;
  name: string;
  icon?: string;
  display?: string;
  excludeFromOptions?: boolean;
  excludeFromToolbar?: boolean;
  extension: Array<AnyExtension | ExtensionFunction>;
  isFormatTool?: boolean;
  shortcut?: string[];
  toolbarButton?: Component;
  disabledInSingleLineMode?: boolean;
  action: (editor: Editor, attrs: TAttrs) => void;
  disabled?: (editor: Editor) => void;
  active?: (editor: Editor) => void;
};

export type InlineRelationTool = Tool<RelationBlockAttrs>;

type ExtensionFunction = (selection: ToolSelection) => AnyExtension;

export type LinkAttributes = { href: string; target?: string | null };

export type InterfaceOption = { text: string; value: string };

export type Dialog = {
  component: Component;
  get: () => void;
  set: (attrs: LinkAttributes) => void;
  unset: () => void;
};
