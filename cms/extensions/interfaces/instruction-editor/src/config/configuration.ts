import { Ref } from "vue";

export const configurationInjectionKey = Symbol();

export interface Configuration {
  relation: {
    /**
     * The collection the editor will insert inline references into
     */
    parentCollection: Ref<string>;
    parentField: Ref<string>;
    /**
     * The alias field to the M2M junction collection
     */
    junctionField: Ref<string>;
    primaryKey: Ref<string | number>;
  };
}
