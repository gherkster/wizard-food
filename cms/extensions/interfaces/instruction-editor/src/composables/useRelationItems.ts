import { useItems } from "@directus/extensions-sdk";
import { ref, toRef } from "vue";

interface ParentCollection {
  id: string | number;
  /**
   * e.g. instruction_id
   */
  fieldName: string;
}

export function useRelationItems() {
  function getItems(collection: string, parentCollection?: ParentCollection) {
    const { loading, items } = useItems(toRef(collection), {
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
    });

    return {
      loading,
      items,
    };
  }

  return {
    getItems,
  };
}
