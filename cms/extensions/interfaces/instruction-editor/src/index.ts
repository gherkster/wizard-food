import customMessages from "./i18n/custom-messages";
import InterfaceComponent from "./interface.vue";
import { useToolStore } from "./stores/toolStore";

export default {
  id: "custom-instruction-editor",
  name: "Instruction Editor",
  icon: "box",
  description: "Recipe instruction editor, storing in JSON and allowing inline ingredients to be inserted",
  component: InterfaceComponent,
  types: ["json"],
  options: ({ collection }: { collection: string }) => {
    const store = useToolStore();
    return [
      {
        field: "m2mField",
        type: "string",
        name: customMessages.m2m_field,
        meta: {
          width: "full",
          interface: "system-field",
          options: {
            collectionName: collection,
            typeAllowList: ["alias"],
            allowNone: true,
          },
          note: "$t:optional",
        },
      },
      {
        field: "tagName",
        type: "string",
        name: "Inline node reference type",
        required: true,
        meta: {
          interface: "select-dropdown",
          options: {
            choices: [
              {
                text: "Recipe",
                value: "inline-recipe",
              },
              {
                text: "Ingredient",
                value: "inline-ingredient",
              },
            ],
          },
        },
      },
      {
        field: "tools",
        name: customMessages.tools_title,
        type: "json",
        schema: {
          default_value: store.interfaceOptionsDefault,
        },
        meta: {
          width: "half",
          interface: "select-multiple-dropdown",
          options: {
            choices: store.interfaceOptions,
          },
        },
      },
    ];
  },
};
