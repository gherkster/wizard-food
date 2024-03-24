import customMessages from "./i18n/custom-messages";
import InterfaceComponent from "./interface.vue";

export default {
  id: "custom-instruction-editor",
  name: "Instruction Editor",
  icon: "box",
  description: "Recipe instruction editor, storing in JSON and allowing inline ingredients to be inserted",
  component: InterfaceComponent,
  types: ["json"],
  options: ({ collection }: { collection: string }) => {
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
    ];
  },
};
