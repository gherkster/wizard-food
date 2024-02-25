<!-- Based on Directus input-rich-text-html.vue ba7fac4 -->
<!-- https://github.com/directus/directus/blob/main/app/src/interfaces/input-rich-text-html/input-rich-text-html.vue -->

<script setup lang="ts">
import Editor from "@tinymce/tinymce-vue";
import { ComponentPublicInstance, computed, inject, Ref, ref, watch } from "vue";
import { useItems } from "@directus/extensions-sdk";
import { useI18n } from "vue-i18n";
import getEditorStyles from "./get-editor-styles";
import useLink from "./useLink";

import { Editor as TinyMCEEditor } from "tinymce";
import { ServerIngredient, ServerRecipe } from "../../../../../common/types/serverRecipe";
import { useRecipeFormatter } from "../../../../../common/composables";

import "tinymce/tinymce";

import "tinymce/icons/default";
import "tinymce/models/dom";
import "tinymce/plugins/autoresize/plugin";
import "tinymce/plugins/code/plugin";
import "tinymce/plugins/directionality/plugin";
import "tinymce/plugins/fullscreen/plugin";
import "tinymce/plugins/image/plugin";
import "tinymce/plugins/insertdatetime/plugin";
import "tinymce/plugins/link/plugin";
import "tinymce/plugins/lists/plugin";
import "tinymce/plugins/media/plugin";
import "tinymce/plugins/pagebreak/plugin";
import "tinymce/plugins/preview/plugin";
import "tinymce/plugins/table/plugin";
import "tinymce/themes/silver";

type CustomFormat = {
  title: string;
  inline: string;
  classes: string;
  styles: Record<string, string>;
  attributes: Record<string, string>;
};

const props = withDefaults(
  defineProps<{
    value: string | null;
    field?: string;
    toolbar?: string[];
    font?: "sans-serif" | "serif" | "monospace";
    customFormats?: CustomFormat[];
    tinymceOverrides?: Record<string, unknown>;
    disabled?: boolean;
    imageToken?: string;
    folder?: string;
    softLength?: number;
    direction?: string;
  }>(),
  {
    toolbar: () => [
      "bold",
      "italic",
      "underline",
      "h1",
      "h2",
      "h3",
      "numlist",
      "bullist",
      "removeformat",
      "blockquote",
      "customLink",
      "code",
      "fullscreen",
      ingredientKey,
    ],
    font: "sans-serif",
    customFormats: () => [],
  },
);

const emit = defineEmits(["input"]);

const { t } = useI18n();
const editorRef = ref<TinyMCEEditor | null>(null);
const editorElement = ref<ComponentPublicInstance | null>(null);

const count = ref(0);

const { linkButton, linkDrawerOpen, closeLinkDrawer, saveLink, linkSelection, linkNode } = useLink(editorRef);

const internalValue = computed({
  get() {
    return props.value || "";
  },
  set(value) {
    if (props.value !== value) {
      contentUpdated();
    }
  },
});

const editorInitialized = ref(false);

const editorDisabled = computed(() => {
  if (!editorInitialized.value) return false;

  return props.disabled;
});

watch(
  () => [props.direction, editorRef],
  () => {
    if (editorRef.value) {
      if (props.direction === "rtl") {
        editorRef.value.editorCommands?.commands?.exec?.mcedirectionrtl();
      } else {
        editorRef.value.editorCommands?.commands?.exec?.mcedirectionltr();
      }
    }
  },
);

const editorOptions = computed(() => {
  let styleFormats = null;

  if (Array.isArray(props.customFormats) && props.customFormats.length > 0) {
    styleFormats = props.customFormats;
  }

  let toolbarString = (props.toolbar ?? [])
    .map((t) =>
      t
        .replace(/^link$/g, "customLink")
        .replace(/^media$/g, "customMedia")
        .replace(/^code$/g, "customCode")
        .replace(/^image$/g, "customImage"),
    )
    .join(" ");

  if (styleFormats) {
    toolbarString += " styles";
  }

  return {
    skin: false,
    content_css: false,
    content_style: getEditorStyles(props.font as "sans-serif" | "serif" | "monospace"),
    plugins: [
      "noneditable",
      "media",
      "table",
      "lists",
      "image",
      "link",
      "pagebreak",
      "code",
      "insertdatetime",
      "autoresize",
      "preview",
      "fullscreen",
      "directionality",
      ingredientKey,
    ],
    branding: false,
    max_height: 1000,
    elementpath: false,
    statusbar: false,
    menubar: false,
    convert_urls: false,
    image_dimensions: false,
    extended_valid_elements: "audio[loop|controls],source[src|type]",
    toolbar: toolbarString,
    style_formats: styleFormats,
    file_picker_types: "customImage customMedia image media",
    link_default_protocol: "https",
    browser_spellcheck: true,
    directionality: props.direction,
    paste_data_images: false,
    setup,
    ...(props.tinymceOverrides || {}),
  };
});

let observer: MutationObserver;
let emittedValue: any;

function setCount() {
  const iframeContents = editorRef.value?.contentWindow.document.getElementById("tinymce");
  count.value = iframeContents?.textContent?.replace("\n", "")?.length ?? 0;
}

function contentUpdated() {
  setCount();

  if (!observer) return;

  const newValue = editorRef.value.getContent() ? editorRef.value.getContent() : null;

  if (newValue === emittedValue) return;

  emittedValue = newValue;
  emit("input", newValue);
}

function setupContentWatcher() {
  if (observer) return;

  const iframeContents = editorRef.value.contentWindow.document.getElementById("tinymce");

  observer = new MutationObserver((_mutations) => {
    contentUpdated();
  });

  const config = { characterData: true, childList: true, subtree: true };
  observer.observe(iframeContents, config);
}

const ingredientKey = "inline-ingredient";
const ingredientSelectorOpen = ref(false);

interface ShallowServerRecipe extends Omit<ServerRecipe, "ingredientGroups" | "instructionGroups"> {
  ingredientGroups: number[];
  instructionGroups: number[];
}

const currentFormValues = inject<Ref<ShallowServerRecipe>>("values");
console.log("current form", currentFormValues);

const currentIngredientGroups = currentFormValues?.value?.ingredientGroups ?? [];

// Return all ingredient groups which are mapped to the current recipe item
// Due to shallow fetching this cannot be retrieved from the injected "values" object
const query = {
  filter: ref({
    _or: currentIngredientGroups.map((ig) => {
      return {
        id: {
          _eq: ig,
        },
      };
    }),
  }),
  fields: ref(["*"]),
};

interface RecipeItemQuery {
  getItems: () => Promise<void>;
  items: Ref<ServerIngredient[]>;
}

const { getItems, items }: RecipeItemQuery = useItems(ref("ingredients"), query);

const currentIngredients = ref<ServerIngredient[]>([]);

// Can't use async here so load the ingredients in the background,
// and assume they will finish loading before they are needed
getItems().then(() => {
  currentIngredients.value = items.value;
});

async function setup(editor: TinyMCEEditor) {
  editorRef.value = editor;

  editor.ui.registry.addToggleButton("customLink", linkButton);

  editor.ui.registry.addButton(ingredientKey, {
    text: "Inline ingredient",
    onAction: async function () {
      // Block until items are loaded in case on a very slow connection etc
      if (!items.value || items.value.length === 0) {
        await getItems();
        currentIngredients.value = items.value;
      }

      ingredientSelectorOpen.value = true;

      console.log(editor.getBody().querySelectorAll(".inline-ingredient"));
      console.log("ingredients", currentIngredients.value);
    },
  });

  editor.on("init", function () {
    editor.shortcuts.remove("meta+k");

    editor.addShortcut("meta+k", "Insert Link", () => {
      editor.ui.registry.getAll().buttons.customlink.onAction();
    });

    setCount();

    editorInitialized.value = true;
  });

  editor.on("OpenWindow", function (e: any) {
    if (e.dialog?.getData) {
      const data = e.dialog?.getData();

      if (data) {
        if (data.url) {
          e.dialog.close();
          editor.ui.registry.getAll().buttons.customlink.onAction();
        }

        if (data.src) {
          e.dialog.close();
          editor.ui.registry.getAll().buttons.customimage.onAction(true);
        }
      }
    }
  });
}

function setFocus(val: boolean) {
  if (editorElement.value == null) return;
  const body = editorElement.value.$el.parentElement?.querySelector(".tox-tinymce");

  if (body == null) return;

  if (val) {
    body.classList.add("focus");
  } else {
    body.classList.remove("focus");
  }
}

const selectedIngredient = ref<ServerIngredient | null>(null);
function insertInlineIngredient() {
  if (selectedIngredient.value) {
    editorRef.value?.insertContent(
      `<span class='inline-ingredient mceNonEditable'>${selectedIngredient.value!.name}</span>`,
    );
  }
  ingredientSelectorOpen.value = false;
}

const recipeFormatter = useRecipeFormatter();
</script>

<template>
  <div :id="field" class="wysiwyg" :class="{ disabled }">
    <editor
      ref="editorElement"
      v-model="internalValue"
      :init="editorOptions"
      :disabled="editorDisabled"
      model-events="change keydown blur focus paste ExecCommand SetContent"
      @focusin="setFocus(true)"
      @focusout="setFocus(false)"
      @focus="setupContentWatcher"
      @set-content="contentUpdated"
    />
    <v-dialog v-model="linkDrawerOpen">
      <v-card>
        <v-card-title>{{ t("wysiwyg_options.link") }}</v-card-title>
        <v-card-text>
          <div class="grid">
            <div class="field">
              <div class="type-label">{{ t("url") }}</div>
              <v-input v-model="linkSelection.url" :placeholder="t('url_placeholder')" autofocus></v-input>
            </div>
            <div class="field">
              <div class="type-label">{{ t("display_text") }}</div>
              <v-input v-model="linkSelection.displayText" :placeholder="t('display_text_placeholder')"></v-input>
            </div>
            <div class="field half">
              <div class="type-label">{{ t("tooltip") }}</div>
              <v-input v-model="linkSelection.title" :placeholder="t('tooltip_placeholder')"></v-input>
            </div>
            <div class="field half-right">
              <div class="type-label">{{ t("open_link_in") }}</div>
              <v-checkbox
                v-model="linkSelection.newTab"
                block
                :label="t(linkSelection.newTab ? 'new_tab' : 'current_tab')"
              ></v-checkbox>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-button secondary @click="closeLinkDrawer">{{ t("cancel") }}</v-button>
          <v-button :disabled="linkSelection.url === null && !linkNode" @click="saveLink">{{ t("save") }}</v-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="ingredientSelectorOpen">
      <v-card>
        <v-card-title>Recipe Ingredients</v-card-title>
        <v-card-text>
          <div class="grid">
            <div class="field" v-for="ingredient in currentIngredients" :key="ingredient">
              <v-radio
                v-model="selectedIngredient"
                :value="ingredient"
                :label="recipeFormatter.formatIngredient(ingredient)"
              />
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-button @click="insertInlineIngredient">Insert</v-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="css">
@import "tinymce/skins/ui/oxide/skin.css";
@import "./tinymce-overrides.css";
</style>

<style lang="css" scoped>
.body {
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: [start] minmax(0, 1fr) [half] minmax(0, 1fr) [full];
  gap: var(--theme--form--row-gap) var(--theme--form--column-gap);

  &.with-fill {
    grid-template-columns:
      [start] minmax(0, var(--form-column-max-width)) [half] minmax(0, var(--form-column-max-width))
      [full] 1fr [fill];
  }

  .type-label {
    margin-bottom: 8px;
  }

  .field {
    grid-column: start / fill;

    @media (min-width: 960px) {
      grid-column: start / full;
    }
  }

  .half,
  .half-left,
  .half-space {
    grid-column: start / fill;

    @media (min-width: 960px) {
      grid-column: start / half;
    }
  }

  .half + .half,
  .half-right {
    grid-column: start / fill;

    @media (min-width: 960px) {
      grid-column: half / full;
    }
  }

  .full {
    grid-column: start / fill;

    @media (min-width: 960px) {
      grid-column: start / full;
    }
  }

  .fill {
    grid-column: start / fill;
  }
}

.remaining {
  position: absolute;
  right: 10px;
  bottom: 5px;
  color: var(--theme--form--field--input--foreground-subdued);
  font-weight: 600;
  text-align: right;
  vertical-align: middle;
  font-feature-settings: "tnum";
}

.warning {
  color: var(--theme--warning);
}

.danger {
  color: var(--theme--danger);
}

.image-preview,
.media-preview {
  width: 100%;
  height: var(--input-height-tall);
  margin-bottom: 24px;
  object-fit: cover;
  border-radius: var(--theme--border-radius);
}

.content {
  padding: var(--content-padding);
  padding-top: 0;
  padding-bottom: var(--content-padding);
}
</style>
