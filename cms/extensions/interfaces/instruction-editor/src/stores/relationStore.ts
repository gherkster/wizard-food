import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ServerIngredient, ServerInstruction } from "../../../../../../common/types/serverRecipe";

/**
 * Contains the new and removed relationships in the junction collection
 */
export type RelationDelta = {
  create: JunctionItemData[];
  delete: (string | number)[];
};

interface JunctionItemData {
  id: string;
  ingredient_id: ServerIngredient;
  instruction_id: ServerInstruction;
}

export const useRelationStore = defineStore("custom-extension-relation", () => {
  const stagedChanges = ref<RelationDelta>({
    create: [],
    delete: [],
  });

  /**
   * Store previously staged item creations to be restored in an undo -> redo scenario.
   */
  const inactiveChanges = ref<Map<string, JunctionItemData>>(new Map());

  const preExistingRelations = ref<JunctionItemData[]>([]);

  const allRelations = computed<JunctionItemData[]>(() => {
    return [...preExistingRelations.value, ...stagedChanges.value.create];
  });

  function $resetStaging() {
    stagedChanges.value = {
      create: [],
      delete: [],
    };
    inactiveChanges.value = new Map();
  }

  return {
    stagedChanges,
    preExistingRelations,
    allRelations,
    inactiveChanges,
    $resetStaging,
  };
});
