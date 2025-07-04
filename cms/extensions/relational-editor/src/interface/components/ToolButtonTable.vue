<template>
  <v-menu show-arrow placement="bottom-start">
    <template #activator="{ toggle }">
      <ToolButton
        :title="title"
        :icon="icon"
        :action="toggle"
        :active="active"
        :disabled="disabled"
        :editor="editor"
      />
    </template>
    <v-list>
      <v-list-item clickable @click="action">
        <v-list-item-content>
          <v-text-overflow :text="t('table.insert')" />
        </v-list-item-content>
      </v-list-item>

      <v-list-group
        :disabled="
          !editor.can().chain().focus().mergeOrSplit().run() &&
          !editor.can().chain().focus().toggleHeaderCell().run()
        "
      >
        <template #activator>
          <v-text-overflow :text="t('table.section_cells')" />
        </template>

        <v-list-item
          clickable
          :disabled="!editor.can().chain().focus().mergeOrSplit().run()"
          @click="editor.chain().focus().mergeOrSplit().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.merge_or_split_cells')" />
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          clickable
          :disabled="!editor.can().chain().focus().toggleHeaderCell().run()"
          @click="editor.chain().focus().toggleHeaderCell().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.toggle_header')" />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-group
        :disabled="
          !editor.can().chain().focus().addColumnBefore().run() &&
          !editor.can().chain().focus().addColumnAfter().run() &&
          !editor.can().chain().focus().deleteColumn().run()
        "
      >
        <template #activator>
          <v-text-overflow :text="t('table.section_columns')" />
        </template>

        <v-list-item
          clickable
          :disabled="!editor.can().chain().focus().addColumnBefore().run()"
          @click="editor.chain().focus().addColumnBefore().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.add_column_before')" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          clickable
          :disabled="!editor.can().chain().focus().addColumnAfter().run()"
          @click="editor.chain().focus().addColumnAfter().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.add_column_after')" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          clickable
          :disabled="!editor.can().chain().focus().deleteColumn().run()"
          @click="editor.chain().focus().deleteColumn().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.delete_column')" />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-group
        :disabled="
          !editor.can().chain().focus().addRowBefore().run() &&
          !editor.can().chain().focus().addRowAfter().run() &&
          !editor.can().chain().focus().deleteRow().run()
        "
      >
        <template #activator>
          <v-text-overflow :text="t('table.section_rows')" />
        </template>

        <v-list-item
          clickable
          :disabled="!editor.can().chain().focus().addRowBefore().run()"
          @click="editor.chain().focus().addRowBefore().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.add_row_before')" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          clickable
          :disabled="!editor.can().chain().focus().addRowAfter().run()"
          @click="editor.chain().focus().addRowAfter().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.add_row_after')" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          clickable
          :disabled="!editor.can().chain().focus().deleteRow().run()"
          @click="editor.chain().focus().deleteRow().run()"
        >
          <v-list-item-content>
            <v-text-overflow :text="t('table.delete_row')" />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import ToolButton from "./ToolButton.vue";
import { useI18n } from "vue-i18n";
import { useI18nFallback } from "../composables/use-i18n-fallback";
import { Tool } from "../../common/types/tools";
import { Editor } from "@tiptap/vue-3";

defineProps<{
  title: string;
  icon?: string;
  action: Tool["action"];
  active: boolean;
  disabled: boolean;
  editor: Editor;
}>();

const { t } = useI18nFallback(useI18n());
</script>
