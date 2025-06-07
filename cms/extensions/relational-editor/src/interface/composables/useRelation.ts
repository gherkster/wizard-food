import { computed, inject } from "vue";
import { Configuration, configurationInjectionKey } from "../config/configuration";
import { useRelationM2M } from "./useRelationM2M";

export function useRelation(configuration?: Configuration) {
  const config = configuration ?? inject<Configuration>(configurationInjectionKey);
  if (!config) {
    throw new Error("Configuration was not provided");
  }

  const { relationInfo } = useRelationM2M(
    config.relation.parentCollection,
    config.relation.junctionField,
  );

  const templateWithDefaults = computed(() => {
    if (!relationInfo.value) return null;

    if (relationInfo.value.junctionCollection.meta?.display_template) {
      return relationInfo.value.junctionCollection.meta.display_template;
    }

    let relatedDisplayTemplate = relationInfo.value.relatedCollection.meta?.display_template;

    if (relatedDisplayTemplate) {
      const regex = /({{.*?}})/g;
      const parts = relatedDisplayTemplate.split(regex).filter((p) => p);

      for (const part of parts) {
        if (part.startsWith("{{") === false) continue;
        const key = part.replace(/{{/g, "").replace(/}}/g, "").trim();
        const newPart = `{{${relationInfo.value.relation.field}.${key}}}`;

        relatedDisplayTemplate = relatedDisplayTemplate.replace(part, newPart);
      }

      return relatedDisplayTemplate;
    }

    return `{{${relationInfo.value.relation.field}.${relationInfo.value.relatedPrimaryKeyField.field}}}`;
  });

  return {
    relation: relationInfo,
    templateWithDefaults,
  };
}
