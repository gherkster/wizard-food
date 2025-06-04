<template>
  <div>
    <v-menu show-arrow placement="bottom-start" :full-height="true">
      <template #activator="{ toggle }">
        <ToolButton
          v-if="toolStore.relationBlockTool && !loading"
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

    <drawer-collection
      v-model:active="selectModalActive"
      :collection="relation?.relatedCollection.collection"
      :filter="filter"
      @input="stageSelects"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch, computed, toRef } from "vue";
import ToolButton from "./ToolButton.vue";
import type { Editor } from "@tiptap/vue-3";
import { v4 as uuidv4 } from "uuid";
import { useRelation } from "../composables/useRelation";
import { useRelationStore } from "../stores/relationStore";
import { Configuration, configurationInjectionKey } from "../config/configuration";
import { useApi, useItems } from "@directus/extensions-sdk";
import { useToolStore } from "../stores/toolStore";
import type { Item, Filter } from "@directus/types";

const props = defineProps<{
  editor: Editor;
}>();

const config = inject<Configuration>(configurationInjectionKey);

const selectModalActive = ref(false);

const { relation } = useRelation();

const relationStore = useRelationStore();

// TODO: This should probably sit somewhere else
const { items: junctionItems } = relationStore.getItems(
  relation.value!.junctionCollection.collection, // E.g. inline_ingredients
  config!.relation.limitToCurrentItem.value
    ? {
        id: config!.relation.primaryKey.value,
        fieldName: relation.value!.reverseJunctionField.field,
      }
    : undefined,
);

// Directus getItems is not async, so watch the result to process results
watch(junctionItems, (loadedItems: Item[]) => {
  if (loadedItems && loadedItems.length > 0) {
    relationStore.preExistingRelations = loadedItems.map((i) => {
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
        },
      };
    });
  }
});

// Hacky way to extract the recipe ID from the URL,
// this is necessary while Directus doesn't provide the current form values for sub-forms
const recipeId = computed(() => {
  if (!window.location.pathname.includes("/recipes/")) {
    return undefined;
  }

  const path = window.location.pathname.endsWith("/")
    ? window.location.pathname.slice(0, -1)
    : window.location.pathname;

  const recipeId = path.split("/").pop();
  if (!recipeId) {
    console.warn("Could not find recipe ID on recipe page");
    return undefined;
  }

  return Number(recipeId);
});

const loading = ref(false);

const filter = ref<Filter>();

interface RecipeQueryResult {
  ingredientGroups: number[];
}

if (recipeId.value && config!.relation.limitToCurrentItem) {
  loading.value = true;
  const { items } = useItems(toRef("recipes"), {
    fields: ref(["*"]),
    filter: ref({
      id: {
        _eq: recipeId.value,
      },
    }),
    limit: ref(-1),
    page: ref(1),
    search: ref(null),
    sort: ref(null),
  });

  watch(
    () => items.value,
    (loadedItems) => {
      if (loadedItems && loadedItems.length > 0) {
        const recipe = items.value[0] as RecipeQueryResult;
        filter.value = {
          ingredientGroup_id: {
            _in: recipe.ingredientGroups,
          },
        };

        loading.value = false;
      }
    },
    {
      immediate: true,
    },
  );
}

const api = useApi();

function selectItem() {
  selectModalActive.value = true;
}

const toolStore = useToolStore();

async function stageSelects(items: [string | number]) {
  const nodeId = uuidv4();

  const relatedItemResponse = await api.get(
    `items/${relation.value!.relatedCollection.collection}/${items[0]}`,
  );

  // TODO: Remove any
  relationStore.stagedChanges.create.push({
    id: nodeId,
    relatedItem: {
      id: relatedItemResponse.data.data.id,
      junctionFieldName: relation.value!.junctionField.field,
      data: relatedItemResponse.data.data,
    },
    parentItem: {
      id: config!.relation.primaryKey.value,
      junctionFieldName: relation.value!.reverseJunctionField.field,
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
