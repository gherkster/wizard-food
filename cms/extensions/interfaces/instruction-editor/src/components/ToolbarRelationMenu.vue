<template>
  <div>
    <v-menu show-arrow placement="bottom-start" :full-height="true">
      <template #activator="{ toggle }">
        <ToolButton
          v-if="toolStore.relationBlockTool"
          :title="toolStore.relationBlockTool!.name"
          :icon="toolStore.relationBlockTool!.icon"
          :action="toggle"
        />
      </template>
      <v-list v-if="relation">
        <v-list-item
          clickable
          :active="toolStore.relationBlockTool!.active?.(editor)"
          :aria-pressed="toolStore.relationBlockTool!.active?.(editor)"
          :disabled="toolStore.relationBlockTool!.disabled?.(editor)"
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
    <drawer-collection
      v-model:active="selectModalActive"
      :collection="relation?.relatedCollection.collection"
      @input="stageSelects"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ToolButton from "./ToolButton.vue";
import type { Editor } from "@tiptap/vue-3";
import { v4 as uuidv4 } from "uuid";
import { useRelation } from "../composables/useRelation";
import { useRelationItems } from "../composables/useRelationItems";
import { useRelationStore } from "../stores/relationStore";
import { Configuration, configurationInjectionKey } from "../config/configuration";
import { inject } from "vue";
import { useApi } from "@directus/extensions-sdk";
import { watch } from "vue";
import { useToolStore } from "../stores/toolStore";
import type { Item } from "@directus/types";

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
watch(items, (loadedItems: Item[]) => {
  if (loadedItems && loadedItems.length > 0) {
    store.preExistingRelations = loadedItems.map((i) => {
      return {
        id: i.id,
        relatedItem: {
          id: i[relation.value!.junctionField.field].id,
          junctionFieldName: relation.value!.junctionField.field,
          data: i[relation.value!.junctionField.field],
        },
        parentItem: {
          id: i[relation.value!.reverseJunctionField.field].id,
          junctionFieldName: relation.value!.reverseJunctionField.field,
          data: i[relation.value!.reverseJunctionField.field],
        },
      };
    });
  }
});

const store = useRelationStore();
const api = useApi();

function selectItem() {
  selectModalActive.value = true;
}

const toolStore = useToolStore();

async function stageSelects(items: [string | number]) {
  const nodeId = uuidv4();

  // TODO: Promise.all
  const relatedItemResponse = await api.get(`items/${relation.value!.relatedCollection.collection}/${items[0]}`);
  const parentItemResponse = await api.get(
    `items/${config!.relation.parentCollection.value}/${config?.relation.primaryKey.value}`,
  );

  // TODO: Remove any
  store.stagedChanges.create.push({
    id: nodeId,
    relatedItem: {
      id: relatedItemResponse.data.data.id,
      junctionFieldName: relation.value!.junctionField.field,
      data: relatedItemResponse.data.data,
    },
    parentItem: {
      id: parentItemResponse.data.data.id,
      junctionFieldName: relation.value!.reverseJunctionField.field,
      data: parentItemResponse.data.data,
    },
  });

  toolStore.relationBlockTool!.action?.(props.editor, {
    id: nodeId,
    junction: relation.value!.junctionCollection.collection,
    collection: relation.value!.relatedCollection.collection,
  });
}
</script>

<style scoped>
.v-list-item.active {
  --v-list-item-icon-color: var(--theme--foreground-subdued, var(--foreground-subdued)) !important;
}
</style>
