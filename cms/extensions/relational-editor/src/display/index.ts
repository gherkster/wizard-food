import { defineDisplay } from "@directus/extensions-sdk";
import component from "./display.vue";

export default defineDisplay({
  id: "custom-editor-display",
  name: "Relational Editor",
  icon: "description",
  description: "Display the content of the Relational Editor as plain text.",
  component,
  options: null,
  types: ["json"],
});
