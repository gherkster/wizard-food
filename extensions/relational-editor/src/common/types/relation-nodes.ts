import { Extension, Mark } from "@tiptap/core";

export type UUID = string;

export type AnyExtension = Extension | Node | Mark;

export type ToolSelection = string[];

export type InterfaceOption = { text: string; value: string };
