import { AnyExtension, Editor } from "@tiptap/core";
import { Component } from "vue";
import { ToolSelection } from "../types/relation-nodes";

export type Tool = {
  key: string;
  name: string;
  icon?: string;
  display?: string;
  excludeFromOptions?: boolean;
  excludeFromToolbar?: boolean;
  extension: Array<AnyExtension | ExtensionFunction>;
  groups?: string[];
  shortcut?: string[];
  toolbarButton?: Component;
  action?: (editor: Editor, attrs?: any) => void;
  disabled?: (editor: Editor) => void;
  active?: (editor: Editor) => void;
};

export type ToolButtonProps = {
  title: string;
  icon: string | boolean;
  display: string | boolean;
  action: Tool["action"];
  shortcut: Tool["shortcut"];
  active: boolean;
  disabled: boolean;
  editor: Editor;
};

type ExtensionFunction = (selection: ToolSelection) => AnyExtension;

export type LinkAttributes = { href: string; target?: string | null };

export type InterfaceOption = { text: string; value: string };

export type Dialog = {
  component: Component;
  get: () => void;
  set: (attrs: LinkAttributes) => void;
  unset: () => void;
};
