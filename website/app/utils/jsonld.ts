import type { WithContext, Graph, Thing } from "schema-dts";

type JsonLD = WithContext<Thing> | WithContext<Thing>[] | Graph | null;

/** Adds a JSON-LD script to the document head */
export const useJsonld = (json: JsonLD | (() => JsonLD)) => {
  if (!json) {
    return;
  }

  const jsonComputed = computed(() => (typeof json === "function" ? json() : json));

  useHead(() => {
    if (!jsonComputed.value) {
      return {};
    }

    return {
      script: [
        {
          type: "application/ld+json",
          innerHTML: jsonComputed.value,
        },
      ],
    };
  });
};
