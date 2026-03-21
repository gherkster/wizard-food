// https://tiptap.dev/api/marks/link

import Link from "@tiptap/extension-link";
import customMessages from "../../i18n/custom-messages";
import type { Editor } from "@tiptap/core";
import { Tool } from "../../../common/types/tools";
import { useLinkStore } from "../../stores/useLinkStore";

const add: Tool = {
  // https://tiptap.dev/api/marks/link
  key: "link",
  name: customMessages.tools.link,
  icon: "link",
  extension: [linkExtensionConfig],
  action: (editor) => {
    useLinkStore().openLinkModal(editor);
  },
  disabled: (editor: Editor) => !editor.can().chain().focus().toggleLink({ href: "" }).run(),
  active: (editor: Editor) => editor.isActive("link"),
};

const remove: Tool = {
  // https://tiptap.dev/api/marks/link
  key: "removeLink",
  name: customMessages.tools.unlink,
  icon: "link_off",
  extension: [linkExtensionConfig],
  action: (editor: Editor) => editor.chain().focus().unsetLink().run(),
  // keep toggleLink for `disabled`
  disabled: (editor: Editor) => !editor.can().chain().focus().toggleLink({ href: "" }).run(),
  active: () => false,
};

const auto: Tool = {
  // If you want to use autolink without a link button
  key: "autolink",
  name: customMessages.tools.autolink,
  excludeFromToolbar: true,
  extension: [linkExtensionConfig],
  action: () => {
    return;
  },
};

function linkExtensionConfig(selection: string[]) {
  const autolink = selection.indexOf("autolink") >= 0;

  return Link.configure({
    autolink,
    linkOnPaste: true,
    openOnClick: false,
  });
}

export default { add, remove, auto };
