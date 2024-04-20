<template>
  <div class="toolbar">
    <toolbar-relation-menu :editor="editor" />

    <v-menu v-if="formatTools.length" show-arrow placement="bottom-start" :full-height="true">
      <template #activator="{ toggle }">
        <v-button
          v-if="displayFormat"
          v-tooltip="t('formats')"
          tabindex="-1"
          :aria-label="t('formats')"
          :disabled="formatToolsDisabled"
          :aria-disabled="formatToolsDisabled"
          small
          class="toolbar-dropdown-button"
          @click="toggle"
        >
          {{ formatToolsDisplay }}
          <v-icon name="arrow_drop_down" />
        </v-button>
        <ToolButton
          v-else
          :title="t('formats')"
          icon="format_paragraph"
          :action="toggle"
          :disabled="formatToolsDisabled"
        />
      </template>
      <v-list class="toolbar-dropdown">
        <v-list-item
          v-for="tool in formatTools"
          :key="tool.key"
          clickable
          :active="tool.active?.(editor)"
          :aria-pressed="tool.active?.(editor)"
          :disabled="tool.disabled?.(editor) || (singleLineMode && tool.disabledInSingleLineMode)"
          @click="tool.action?.(editor)"
        >
          <v-list-item-icon v-if="tool.icon">
            <v-icon :name="tool.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-text-overflow :text="tool.name" />
          </v-list-item-content>
          <v-list-item-hint>{{ translateShortcut(tool.shortcut as string[]) }}</v-list-item-hint>
        </v-list-item>
      </v-list>
    </v-menu>

    <component
      :is="tool.toolbarButton ?? ToolButton"
      v-for="tool in buttonTools"
      :key="tool.key"
      :title="tool.name"
      :icon="tool.icon"
      :display="tool.display"
      :shortcut="tool.shortcut"
      :action="() => toolAction(tool)"
      :active="tool.active?.(editor)"
      :disabled="tool.disabled?.(editor) || (singleLineMode && tool.disabledInSingleLineMode)"
      :editor="editor"
    />

    <v-dialog v-model="showDialog">
      <component
        :is="dialog!.component"
        :get="dialog!.get"
        @set="dialog!.set"
        @unset="dialog!.unset"
        @close-dialog="dialog = null"
      ></component>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ToolButton from "./ToolButton.vue";
import ToolbarRelationMenu from "./ToolbarRelationMenu.vue";
import { useI18n } from "vue-i18n";
import { useI18nFallback } from "../composables/use-i18n-fallback";
import type { Tool, Dialog } from "../tiptap/types";
import type { Editor } from "@tiptap/vue-3";
import { capitalize } from "lodash";

// Props
interface Props {
  tools: Tool[];
  editor: Editor;
  singleLineMode: boolean;
  displayFormat: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  displayFormat: false,
});

const { t, $t } = useI18nFallback(useI18n());

// Split up tools to types
const buttonTools = ref<Tool[]>([]);
const formatTools = ref<Tool[]>([]);
props.tools.forEach((tool) => {
  if (tool.excludeFromToolbar) {
    return;
  }

  tool.name = $t(tool.name);

  if (tool.groups && tool.groups.indexOf("format") >= 0) {
    formatTools.value.push(tool);
    return;
  }

  buttonTools.value.push(tool);
});
const formatToolsDisabled = computed(() => formatTools.value.every((tool) => tool.disabled?.(props.editor)));
const formatToolsDisplay = computed(() => {
  const activeFormat: Tool[] = formatTools.value.filter((tool: Tool) => tool.active?.(props.editor));

  if (activeFormat.length) return activeFormat.map((tool) => tool.name)[0];

  return t("tools.paragraph");
});

function translateShortcut(keys: string[]): string {
  const isMac = navigator.platform.toLowerCase().startsWith("mac") || navigator.platform.startsWith("iP");

  if (isMac) {
    return keys
      .map((key) => {
        if (key === "meta") return "⌘";
        if (key === "option") return "⌥";
        if (key === "shift") return "⇧";
        if (key === "alt") return "⌥";
        return capitalize(key);
      })
      .join("");
  } else {
    return keys
      .map((key) => {
        if (key === "meta") return "Ctrl";
        return capitalize(key);
      })
      .join("+");
  }
}

// Dialog
const dialog = ref<Dialog | null>(null);
const showDialog = computed(() => dialog.value !== null);

// Action (click) method
const toolAction = (tool: Tool) => tool.action?.(props.editor, { dialog });
</script>

<style scoped>
.toolbar {
  --v-button-background-color: transparent;
  --v-button-color: var(--theme--foreground, var(--foreground-normal));
  --v-button-background-color-hover: var(--theme--border-color, var(--border-normal));
  --v-button-color-hover: var(--theme--foreground, var(--foreground-normal));
  --v-button-background-color-active: var(--theme--border-color, var(--border-normal));
  --v-button-color-active: var(--theme--foreground, var(--foreground-normal));
  --v-button-background-color-disabled: transparent;
  --v-button-color-disabled: var(--theme--foreground-subdued, var(--foreground-subdued));

  --toolbar-item-m: 1px;
  --toolbar-dropdown-p: 2px;
}

.toolbar-dropdown-button :deep(.button) {
  --v-button-min-width: 0;
  padding-left: calc(var(--theme--form--field--input--padding, var(--input-padding)) - var(--toolbar-dropdown-p) * 2);
  padding-right: 4px;
}

.toolbar-dropdown {
  --v-list-item-background-color-active: var(--theme--border-color, var(--border-normal));
}

.toolbar {
  border-bottom: var(--theme--border-width, var(--border-width)) solid var(--theme--border-color, var(--border-normal));
  padding: var(--toolbar-item-m);
}

.toolbar :deep(> *) {
  display: inline-flex;
  margin: var(--toolbar-item-m);
  vertical-align: middle;
}
</style>
../../common/types/types