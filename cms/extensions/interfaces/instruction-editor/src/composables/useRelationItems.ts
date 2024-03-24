import { useItems } from "@directus/extensions-sdk";
import { ref, toRef } from "vue";

export function useRelationItems() {
  function getItems(collection: string, parentCollectionId: string | number) {
    const { loading, items } = useItems(toRef(collection), {
      // TODO Only get required fields
      fields: ref(["*.*"]),
      filter: ref({
        // TODO Don't hardcode
        instruction_id: {
          id: {
            _eq: parentCollectionId,
          },
        },
      }),
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
