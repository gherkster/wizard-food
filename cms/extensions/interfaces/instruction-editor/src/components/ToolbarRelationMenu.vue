<template>
  <div>
    <v-menu show-arrow placement="bottom-start" :full-height="true">
      <template #activator="{ toggle }">
        <ToolButton :title="relationBlockTool!.name" :icon="relationBlockTool!.icon" :action="toggle" />
      </template>
      <v-list v-if="relation">
        <v-list-item
          clickable
          :active="relationBlockTool!.active?.(editor)"
          :aria-pressed="relationBlockTool!.active?.(editor)"
          :disabled="relationBlockTool!.disabled?.(editor)"
          @click="selectItem()"
        >
          <v-list-item-icon>
            <v-icon :name="relation.relatedCollection.icon" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-text-overflow :text="relation.relatedCollection.name" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Don't hardcode collection name -->
    <drawer-collection v-model:active="selectModalActive" collection="ingredients" @input="stageSelects" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ToolButton from "./ToolButton.vue";
import { relationBlockTool } from "../tiptap/tools";
import type { Editor } from "@tiptap/vue-3";
import { v4 as uuidv4 } from "uuid";
import { useRelation } from "../composables/useRelation";
import { useRelationItems } from "../composables/useRelationItems";
import { useRelationStore } from "../stores/relationStore";
import { Configuration, configurationInjectionKey } from "../config/configuration";
import { inject } from "vue";
import { useApi } from "@directus/extensions-sdk";
import { watch } from "vue";

const props = defineProps<{
  editor: Editor;
}>();

const config = inject<Configuration>(configurationInjectionKey);

const selectModalActive = ref(false);

const { relation } = useRelation();

// TODO: This should probably sit somewhere else
const relationItems = useRelationItems();

const { items } = relationItems.getItems(
  relation.value!.junctionCollection.collection,
  config!.relation.primaryKey.value,
);

// TODO: Remove any
watch(items, (loadedItems: any) => {
  if (loadedItems && loadedItems.length > 0) {
    store.preExistingRelations = loadedItems;
  }
});

const store = useRelationStore();
const api = useApi();

function selectItem() {
  selectModalActive.value = true;
}

async function stageSelects(items: [string | number]) {
  const nodeId = uuidv4();

  // TODO: Promise.all
  const ingredientResponse = await api.get(`items/ingredients/${items[0]}`);
  const instructionResponse = await api.get(`items/instructions/${config?.relation.primaryKey.value}`);

  store.stagedChanges.create.push({
    id: nodeId,
    ingredient_id: ingredientResponse.data.data, // TODO: Remove any
    instruction_id: instructionResponse.data.data, // TODO: Remove any
  });

  // TODO: Don't hardcode collections
  relationBlockTool!.action?.(props.editor, {
    id: nodeId,
    junction: "inline_ingredients",
    collection: "ingredients",
  });
}
</script>

<style scoped>
.v-list-item.active {
  --v-list-item-icon-color: var(--theme--foreground-subdued, var(--foreground-subdued)) !important;
}
</style>
