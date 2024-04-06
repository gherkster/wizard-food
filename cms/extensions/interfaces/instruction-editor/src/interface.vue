<template>
  <div v-if="editor" :class="{ disabled }" class="field">
    <toolbar
      v-if="tools.length"
      :tools="selectedTools(tools)"
      :editor="editor"
      :display-format="displayFormat"
    ></toolbar>
    <editor-content
      :editor="editor"
      :spellcheck="spellcheck ? 'true' : 'false'"
      :class="{ [font]: true, [editorHeight]: true }"
      class="flexible-editor"
    />
  </div>
</template>

<script setup lang="ts">
import Toolbar from "./components/Toolbar.vue";
import type { EditorContent, JSONContent } from "@tiptap/vue-3";
import { useEditor } from "@tiptap/vue-3";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Placeholder from "@tiptap/extension-placeholder";
import Paragraph from "@tiptap/extension-paragraph";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import InlineRelation from "./nodes/inline-relation";
import { defaultSelectedTools, pickSelectedTools, selectedTools } from "./tiptap/tools";
import { provide, toRef, watch } from "vue";
import { Configuration, configurationInjectionKey } from "./config/configuration";
import { RelationDelta, useRelationStore } from "./stores/relationStore";
import { useEditorStoreSync } from "./composables/useEditorStoreSync";

const props = withDefaults(
  defineProps<{
    value: string | null;
    m2mField: string;
    disabled: boolean;
    placeholder: string;
    tools: string[];
    displayFormat: boolean;
    font: string;
    spellcheck: boolean;
    editorHeight: "height-fixed" | "height-grow" | "height-grow-till-overflow";
    field: string | null;
    collection: string | null;
    primaryKey: string | number | null;
  }>(),
  {
    disabled: false,
    placeholder: "",
    tools: () => defaultSelectedTools,
    displayFormat: false,
    font: "sans-serif",
    spellcheck: false,
    editorHeight: "height-grow-till-overflow",
    field: null,
    collection: null,
    primaryKey: null,
  },
);

// TODO: Throw error if junction collection primary key is not uuid

// TODO: Stop hardcoding
interface InlineIngredient {
  id: string;
  instruction_id: string | number;
  ingredient_id: string | number;
}

interface EmittedRelationUpdate {
  create: InlineIngredient[];
  update: InlineIngredient[];
  delete: (string | number)[];
}

const emit = defineEmits<{
  /** Editor content JSON */
  input: [value: JSONContent | null];
  /** Update M2M relations through junction */
  setFieldValue: [value: { field: string; value: EmittedRelationUpdate }];
}>();

// TODO: Do mapping somewhere else
function emitRelationChanges(change: RelationDelta) {
  const emittedValue: EmittedRelationUpdate = {
    create: change.create.map((create) => {
      return {
        id: create.id,
        ingredient_id: create.ingredient_id.id,
        instruction_id: create.instruction_id.id,
      };
    }),
    update: [], // Updates are not required for this interface
    delete: change.delete,
  };
  emit("setFieldValue", {
    field: props.m2mField,
    value: emittedValue,
  });
}

const store = useRelationStore();

watch(
  () => store.stagedChanges,
  (change) => {
    emitRelationChanges(change);
  },
  {
    deep: true,
  },
);

// TODO: Required props shouldn't be allowed to be empty strings

const config: Configuration = {
  relation: {
    parentCollection: toRef(props.collection ?? ""),
    parentField: toRef(props.field ?? ""),
    junctionField: toRef(props.m2mField ?? ""),
    primaryKey: toRef(props.primaryKey ?? ""),
  },
};

provide(configurationInjectionKey, config);

const editorSync = useEditorStoreSync();

const editor = useEditor({
  content: props.value,
  extensions: [
    Document,
    Text,
    Paragraph,
    Placeholder.configure({ placeholder: props.placeholder }),
    Dropcursor,
    Gapcursor,
    InlineRelation,
    ...pickSelectedTools(props.tools),
  ],
  async onUpdate({ editor }) {
    editorSync.syncEditorWithRelationChanges(editor);

    const editorValue = editor.getJSON();
    const emptyJSON = { type: "doc", content: [{ type: "paragraph" }] };
    const isEmpty = JSON.stringify(editorValue) === JSON.stringify(emptyJSON);

    if (isEmpty) {
      editor.commands.setContent(null, false);
    }

    emit("input", isEmpty ? null : editorValue);
  },
});

watch(
  () => props.value,
  (value, oldValue) => {
    if (oldValue === null) {
      // Reset staging values when navigating away and returning to the interface
      // This resolves an issue where if nodes are deleted and then the user navigates away,
      // upon returning the nodes would still be staged for removal even after the content has been restored
      store.$resetStaging();
    }

    const isSame = JSON.stringify(editor.value?.getJSON()) === JSON.stringify(value);
    if (isSame) {
      return;
    }
    editor.value?.commands.setContent(value, false);
  },
);
</script>

<style>
.tiptap .relation-block {
  display: inline-block;
}

.tiptap .relation-block .link {
  height: unset !important;
  padding: 4px 8px !important;
  margin: 0 2px !important;
}

.tiptap .render-template span {
  user-select: none;
}
</style>

<style scoped>
.errors > div:not(:first-child) {
  margin-top: 8px;
}

/* Field */
.field {
  color: var(--theme--form--field--input--foreground, var(--foreground));
  background-color: var(--theme--form--field--input--background, var(--background-page));
  border: var(--theme--border-width, var(--border-width)) solid
    var(--theme--form--field--input--border-color, var(--border-normal));
  border-radius: var(--theme--border-radius, var(--border-radius));
}

.field:hover {
  border-color: var(--theme--form--field--input--border-color-hover, var(--border-normal-alt));
}

.field:focus-within {
  border-color: var(--theme--form--field--input--border-color-focus, var(--primary));
  box-shadow: var(--theme--form--field--input--box-shadow-focus, 0 0 16px -8px var(--v-input-box-shadow-color-focus));
}

.disabled {
  color: var(--theme--form--field--input--foreground-subdued, var(--foreground-subdued));
  background-color: var(--theme--form--field--input--background-subdued, var(--background-subdued));
  border-color: var(--theme--form--field--input--border-color, var(--border-normal));
  pointer-events: none;
}

/* Fonts */
.monospace {
  font-family: var(--theme--font-family-monospace, var(--family-monospace));
}

.serif {
  font-family: var(--theme--font-family-serif, var(--family-serif));
}

.sans-serif {
  font-family: var(--theme--font-family-sans-serif, var(--family-sans-serif));
}

/* Editor */
.field {
  --editor-lineheight: 1.6;
  --editor-input-padding: var(--theme--form--field--input--padding, var(--input-padding));
  /* --editor-height = --editor-lineheight * 7 */
  --editor-height: calc(11.2em + var(--editor-input-padding) + var(--editor-input-padding));
  --editor-overflow-height: calc(
    100vh - var(--header-bar-height) - var(--header-bar-height) - var(--theme--form--row-gap, var(--form-vertical-gap)) -
      var(--theme--form--row-gap, var(--form-vertical-gap)) - var(--editor-input-padding) - var(--editor-input-padding)
  );
}

.flexible-editor {
  --editor-block-mt: 24px;
}

.flexible-editor {
  background-color: transparent;
}

/* Editor Size */
.flexible-editor :deep(.ProseMirror) {
  line-height: var(--editor-lineheight);
  padding: var(--theme--form--field--input--padding, var(--input-padding));
  overflow: auto;
}

.flexible-editor.height-fixed :deep(.ProseMirror) {
  height: var(--editor-height);
}

.flexible-editor.height-grow-till-overflow :deep(.ProseMirror),
.flexible-editor.height-grow :deep(.ProseMirror) {
  min-height: var(--editor-height);
}

.flexible-editor.height-grow-till-overflow :deep(.ProseMirror) {
  max-height: var(--editor-overflow-height);
}

/* Editor Styles */
.flexible-editor :deep(.ProseMirror blockquote > * ~ *),
.flexible-editor :deep(.ProseMirror > * ~ *) {
  margin-top: var(--editor-block-mt);
}

.flexible-editor :deep(h1),
.flexible-editor :deep(h2),
.flexible-editor :deep(h3),
.flexible-editor :deep(h4),
.flexible-editor :deep(h5),
.flexible-editor :deep(h6) {
  line-height: 1.4;
}

.flexible-editor :deep(h1) {
  font-size: 2.5em;
}

.flexible-editor :deep(h2) {
  font-size: 2.25em;
}

.flexible-editor :deep(h3) {
  font-size: 2em;
}

.flexible-editor :deep(h4) {
  font-size: 1.75em;
}

.flexible-editor :deep(h5) {
  font-size: 1.5em;
}

.flexible-editor :deep(h6) {
  font-size: 1.25em;
}

.flexible-editor :deep(hr) {
  color: transparent;
  background-color: var(--theme--border-color, var(--border-normal));
  height: 7px;
  border: 3px solid var(--theme--background, var(--background-page));
  border-left: none;
  border-right: none;
}

.flexible-editor :deep(blockquote) {
  border-left: var(--theme--border-width, var(--border-width)) solid var(--theme--border-color, var(--border-normal));
  padding-left: var(--theme--form--field--input--padding, var(--input-padding));
}

.flexible-editor :deep(strong) {
  font-weight: bold;
}

.flexible-editor :deep(a) {
  color: var(--theme--primary, var(--primary));
  border-bottom: 1px solid var(--theme--primary, var(--primary));
}

.flexible-editor :deep(code) {
  background-color: var(--theme--background-normal, var(--background-normal));
  padding: 2px 4px;
  border-radius: var(--theme--border-radius, var(--border-radius));
}

.flexible-editor :deep(pre) {
  background-color: var(--theme--background-normal, var(--background-normal));
  padding: var(--theme--form--field--input--padding, var(--input-padding));
  border-radius: var(--theme--border-radius, var(--border-radius));
}

.flexible-editor :deep(pre code) {
  padding: 0;
}

.flexible-editor :deep(ol),
.flexible-editor :deep(ul) {
  padding-left: var(--theme--form--field--input--padding, var(--input-padding));
}

.flexible-editor :deep(table) {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 0;
  overflow: hidden;
}

.flexible-editor :deep(table th) {
  background-color: var(--theme--background-subdued);
}

.flexible-editor :deep(table th),
.flexible-editor :deep(table td) {
  padding: 0.25em 0.5em;
  border: var(--theme--border-width) solid var(--theme--border-color);
  text-align: start;
  vertical-align: top;
  box-sizing: border-box;
}

.flexible-editor :deep(table .selectedCell) {
  background: var(--theme--primary);
  color: var(--theme--background-subdued);
}

/* Placeholder */
.flexible-editor :deep(p.is-editor-empty:first-child::before) {
  color: var(--theme--foreground-subdued, var(--v-input-placeholder-color));
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

/* Make gap cursor appear like a normal cursor */
.flexible-editor :deep(.ProseMirror .ProseMirror-gapcursor) {
  position: relative;
  font-size: 1em;
  line-height: var(--editor-lineheight);
}

.flexible-editor :deep(.ProseMirror .ProseMirror-gapcursor:after) {
  position: absolute;
  top: auto;
  right: 0;
  z-index: 1;
  bottom: var(--editor-block-mt);
  display: block;
  width: 0;
  height: 1.1em;
  /* This works as long as every block the gapcursor is appended has a height of `--input-height` */
  height: var(--theme--form--field--input--height, var(--input-height));
  border-top: none;
  border-left: 1px solid black;
}

.flexible-editor :deep(.ProseMirror .ProseMirror-gapcursor:first-child:after) {
  right: auto;
  left: 0;
  bottom: auto;
  top: 0;
}

/* .flexible-editor :deep(.ProseMirror:not(.ProseMirror-focused) > .ProseMirror-gapcursor:first-of-type + *) */
.flexible-editor :deep(.ProseMirror .ProseMirror-gapcursor:first-child + *),
.flexible-editor :deep(.ProseMirror .ProseMirror-gapcursor:last-child) {
  margin-top: 0;
}

.flexible-editor :deep(.ProseMirror .ProseMirror-gapcursor:last-child:after) {
  bottom: 0;
}
</style>

<style>
/* not scoped */
.prosemirror-dropcursor-block {
  background-color: var(--theme--border-color, var(--border-normal)) !important;
}
</style>
