import { useItems } from "@directus/extensions-sdk";
import { defineStore } from "pinia";
import { computed, ref, toRef, watch } from "vue";

/**
 * Contains the new and removed relationships in the junction collection
 */
export type RelationDelta = {
  create: JunctionItemData[];
  delete: (string | number)[];
};

interface JunctionItemData {
  id: string;
  relatedItem: {
    id: string | number;
    /**
     * e.g. ingredient_id
     */
    junctionFieldName: string;
    data: unknown;
  };
  parentItem: {
    /**
     * This may just be a "+" when creating a new item at the same time
     */
    id: string | number;
    /**
     * e.g. instruction_id
     */
    junctionFieldName: string;
  };
}

interface ParentCollection {
  id: string | number;
  /**
   * e.g. instruction_id
   */
  fieldName: string;
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

  const isLoadingItems = ref(false);

  const getItems = (collection: string, parentCollection?: ParentCollection) => {
    const query = {
      // TODO Only get required fields
      fields: ref(["*.*"]),
      filter: ref(
        parentCollection
          ? {
              [parentCollection.fieldName]: {
                id: {
                  _eq: parentCollection.id,
                },
              },
            }
          : null,
      ),
      limit: ref(-1),
      page: ref(1),
      search: ref(null),
      sort: ref(null),
    };

    const result = useItems(toRef(collection), query);

    watch(
      () => result.loading,
      (isLoading) => {
        isLoadingItems.value = isLoading.value;
      },
    );

    return result;
  };

  function $resetStaging() {
    stagedChanges.value = {
      create: [],
      delete: [],
    };
    inactiveChanges.value = new Map();
  }

  return {
    getItems,
    isLoadingItems,
    stagedChanges,
    preExistingRelations,
    allRelations,
    inactiveChanges,
    $resetStaging,
  };
});
