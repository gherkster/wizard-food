import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Dialog, LinkAttributes } from "../../common/types/tools";
import DialogLink from "../components/DialogLink.vue";
import type { Editor } from "@tiptap/core";

export const useLinkStore = defineStore("link-store", () => {
  const dialog = ref<Dialog>();

  const isDialogOpen = computed(() => !!dialog.value);

  const openLinkModal = (editor: Editor) => {
    dialog.value = {
      component: DialogLink,
      get: () => editor.getAttributes("link"),
      set: (attrs: LinkAttributes) =>
        editor.chain().focus().extendMarkRange("link").setLink(attrs).run(),
      unset: () => editor.chain().focus().extendMarkRange("link").unsetLink().run(),
    };
  };

  const closeLinkModal = () => (dialog.value = undefined);

  return {
    dialog,
    isDialogOpen,
    openLinkModal,
    closeLinkModal,
  };
});
