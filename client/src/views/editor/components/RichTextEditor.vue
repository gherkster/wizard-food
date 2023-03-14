<template>
  <div class="n-form-item __form-item-lt n-form-item--large-size n-form-item--top-labelled" v-if="editor">
    <label v-if="props.label" class="n-form-item-label n-form-item-label--right-mark">
      <span class="n-form-item-label__text">{{ props.label }}</span>
    </label>
    <div class="rich-text-editor__wrapper">
      <div class="rich-text-editor__controls">
        <div class="rich-text-editor__control-group">
          <n-button :class="{ 'n-button--active': editor.isActive('bold') }" :bordered="false" @click="toggleBold">
            <font-awesome-icon icon="fa-bold" size="lg" />
          </n-button>
          <n-button :class="{ 'n-button--active': editor.isActive('italic') }" :bordered="false" @click="toggleItalic">
            <font-awesome-icon icon="fa-italic" size="lg" />
          </n-button>
          <n-button :class="{ 'n-button--active': editor.isActive('strike') }" :bordered="false" @click="toggleStrikethrough">
            <font-awesome-icon icon="fa-strikethrough" size="lg" />
          </n-button>
          <n-button :class="{ 'n-button--active': editor.isActive('link') }" :bordered="false" @click="toggleLink">
            <font-awesome-icon icon="fa-link" size="lg" />
          </n-button>
        </div>
        <div class="rich-text-editor__control-group">
          <n-button :class="{ 'n-button--active': editor.isActive('heading') }" :bordered="false" @click="toggleHeading">
            <font-awesome-icon icon="fa-heading" size="lg" />
          </n-button>
          <n-button :class="{ 'n-button--active': editor.isActive('bulletList') }" :bordered="false" @click="toggleBulletList">
            <font-awesome-icon icon="fa-list-ul" size="lg" />
          </n-button>
          <n-button :class="{ 'n-button--active': editor.isActive('orderedList') }" :bordered="false" @click="toggleNumericList">
            <font-awesome-icon icon="fa-list-ol" size="lg" />
          </n-button>
        </div>
        <div class="rich-text-editor__control-group">
          <n-button :bordered="false" @click="undo" :disabled="!editor.can().chain().focus().undo().run()">
            <font-awesome-icon icon="fa-rotate-left" size="lg" />
          </n-button>
          <n-button :bordered="false" @click="redo" :disabled="!editor.can().chain().focus().redo().run()">
            <font-awesome-icon icon="fa-rotate-right" size="lg" />
          </n-button>
        </div>
      </div>
      <empty-input-wrapper @focus="editor.chain().focus('end').run()">
        <editor-content :editor="editor" class="rich-text-editor__content" />
      </empty-input-wrapper>
    </div>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { NButton } from "naive-ui";
import StarterKit from "@tiptap/starter-kit";
import EmptyInputWrapper from "@/views/editor/components/EmptyInputWrapper.vue";
import { watch } from "vue";

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
});

const emit = defineEmits(["input"]);

const editor = useEditor({
  content: props.value,
  extensions: [StarterKit],
  onUpdate: (e) => {
    emit("input", e.editor.getHTML());
  },
});

// Simulate reactivity on component props since it is not provided out of the box
watch(props, () => {
  const isContentSame = editor.value.getHTML() === props.value;
  if (!isContentSame) {
    editor.value.commands.setContent(props.value, false);
  }
});

const toggleBold = () => editor.value.chain().focus().toggleBold().run();
const toggleItalic = () => editor.value.chain().focus().toggleItalic().run();
const toggleStrikethrough = () => editor.value.chain().focus().toggleStrike().run();
const toggleHeading = () => editor.value.chain().focus().toggleHeading({ level: 4 }).run();
const toggleBulletList = () => editor.value.chain().focus().toggleBulletList().run();
const toggleNumericList = () => editor.value.chain().focus().toggleOrderedList().run();
const undo = () => editor.value.chain().focus().undo().run();
const redo = () => editor.value.chain().focus().redo().run();

function toggleLink() {
  console.log("toggling");
  // TODO: Add link creation
  // Need to create a component which pops up and has a field for the URL and a field for the display text
  // If the user was highlighting text at the time, prefill that into the display text field
  // If the user had the cursor on a link when this is clicked, remove the link
}
</script>

<style lang="scss">
.ProseMirror-focused:focus-visible {
  outline: none;
}
</style>

<style lang="scss" scoped>
@use "../../../styles/mixins" as m;
@use "../../../styles/variables" as v;

.rich-text-editor {
  &__wrapper {
    overflow: hidden;
    border-radius: v.$border-radius;
  }
  &__controls {
    display: flex;
    flex-wrap: wrap;
    background-color: v.$colour-bg-grey-light;
    @include m.spacing("gx", "xs");
    padding: 4px;
  }
  &__control-group {
    display: flex;
    .n-button {
      min-width: unset;
    }
  }
  &__content {
    min-height: 15vh;
  }
}
</style>
