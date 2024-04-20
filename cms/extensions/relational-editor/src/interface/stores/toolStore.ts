import { defineStore } from "pinia";
import { Tool } from "../../common/types/tools";
import heading from "../tiptap/options/heading";
import history from "../tiptap/options/history";
import paragraph from "../tiptap/options/paragraph";
import codeBlock from "../tiptap/options/code-block";
import bold from "../tiptap/options/bold";
import italic from "../tiptap/options/italic";
import strike from "../tiptap/options/strike";
import code from "../tiptap/options/code";
import link from "../tiptap/options/link";
import hardBreak from "../tiptap/options/hard-break";
import horizontalRule from "../tiptap/options/horizontal-rule";
import bulletList from "../tiptap/options/bullet-list";
import orderedList from "../tiptap/options/ordered-list";
import blockquote from "../tiptap/options/blockquote";
import table from "../tiptap/options/table";
import { useTipTap } from "../composables/useTipTap";
import { ToolSelection } from "../../common/types/relation-nodes";
import { AnyExtension } from "@tiptap/core";
import { computed, ref } from "vue";

export const useToolStore = defineStore("tool-store", () => {
  const tiptap = useTipTap();

  const tools = ref<Tool[]>([
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
  ]);

  const tagName = ref<string>();

  function setInlineNodeTool(nameOfTag: string) {
    tagName.value = nameOfTag;
    tools.value.push(tiptap.createInlineNodeTool(nameOfTag));
  }

  const selectedToolOptions = ref<string[]>([]);
  function pickSelectedTools(selection: ToolSelection): AnyExtension[] {
    const toolsExtensions: AnyExtension[] = [];
    const uniqueNames: string[] = [];
    selectedToolOptions.value = selection;

    selectedTools.value.forEach(({ extension }) =>
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
  }

  const selectedTools = computed(() => {
    return tools.value.filter(({ key }) => selectedToolOptions.value.indexOf(key) >= 0);
  });

  const optionalTools = computed(() => {
    return tools.value.filter((tool) => !tool.excludeFromOptions);
  });

  const interfaceOptions = computed(() => {
    return optionalTools.value.map(({ key, name }) => ({ text: name, value: key }));
  });

  const interfaceOptionsDefault = optionalTools.value.map(({ key }) => key);

  const defaultSelectedTools = computed(() => optionalTools.value.map(({ key }) => key));

  const relationBlockTool = computed(() => tools.value.find(({ key }) => key === tagName.value));

  return {
    tools,
    tagName,
    setInlineNodeTool,
    pickSelectedTools,
    selectedTools,
    optionalTools,
    interfaceOptions,
    interfaceOptionsDefault,
    defaultSelectedTools,
    relationBlockTool,
  };
});
