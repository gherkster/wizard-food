import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { AnyExtension } from "@tiptap/core";

import strike from "../tiptap/options/strike";
import paragraph from "../tiptap/options/paragraph";
import orderedList from "../tiptap/options/ordered-list";
import link from "../tiptap/options/link";
import italic from "../tiptap/options/italic";
import horizontalRule from "../tiptap/options/horizontal-rule";
import history from "../tiptap/options/history";
import heading from "../tiptap/options/heading";
import hardBreak from "../tiptap/options/hard-break";
import bulletList from "../tiptap/options/bullet-list";
import bold from "../tiptap/options/bold";
import blockquote from "../tiptap/options/blockquote";
import { useTipTap } from "../composables/useTipTap";
import { Tool, type InlineRelationTool } from "../../common/types/tools";
import { ToolSelection } from "../../common/types/relation-nodes";

export const useToolStore = defineStore("tool-store", () => {
  const tiptap = useTipTap();

  const basicTools = ref<Tool[]>([
    paragraph,
    heading(1),
    heading(2),
    heading(3),
    heading(4),
    heading(5),
    heading(6),
    bold,
    italic,
    strike,
    hardBreak,
    horizontalRule,
    bulletList,
    orderedList,
    blockquote,
    history.undo,
    history.redo,
    link.add,
    link.remove,
    link.auto,
  ]);

  const inlineRelationTool = ref<InlineRelationTool>();

  const tools = computed(() => {
    if (inlineRelationTool.value) {
      return [...basicTools.value, inlineRelationTool.value];
    }

    return [...basicTools.value];
  });

  const tagName = ref<string>();

  function setInlineNodeTool(nameOfTag: string) {
    tagName.value = nameOfTag;
    inlineRelationTool.value = tiptap.createInlineNodeTool(nameOfTag);
  }

  const selectedToolNames = ref<string[]>([]);

  function pickSelectedTools(selection: ToolSelection): AnyExtension[] {
    const toolsExtensions: AnyExtension[] = [];
    const uniqueNames: string[] = [];
    selectedToolNames.value = selection;

    selectedBasicTools.value.forEach(({ extension }) => {
      extension.forEach((item) => {
        const extensionItem = typeof item === "function" ? item(selection) : item;
        const extensionNotExists = uniqueNames.indexOf(extensionItem.name) < 0;

        if (extensionNotExists) {
          uniqueNames.push(extensionItem.name);
          toolsExtensions.push(extensionItem);
        }
      });
    });

    return toolsExtensions;
  }

  const selectedBasicTools = computed(() => {
    return basicTools.value.filter(({ key }) => selectedToolNames.value.includes(key));
  });

  const pickableTools = computed(() => {
    return tools.value.filter((tool) => !tool.excludeFromOptions);
  });

  const interfaceOptions = computed(() => {
    return pickableTools.value.map(({ key, name }) => ({ text: name, value: key }));
  });

  const interfaceOptionsDefault = pickableTools.value.map(({ key }) => key);

  const defaultSelectedTools = computed(() => pickableTools.value.map(({ key }) => key));

  return {
    selectedBasicTools,
    inlineRelationTool,
    tagName,
    setInlineNodeTool,
    pickSelectedTools,
    selectedToolNames,
    interfaceOptions,
    interfaceOptionsDefault,
    defaultSelectedTools,
  };
});
