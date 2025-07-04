<template>
  <node-view-wrapper class="relation-block">
    <v-skeleton-loader v-if="relationStore.isLoadingItems" type="block-list-item" />
    <div v-else-if="element" class="v-list-item link block clickable">
      <v-icon
        data-drag-handle
        class="drag-handle"
        name="drag_handle"
        draggable="true"
        left
        @click.stop
      />
      <render-template
        :collection="relation?.junctionCollection.collection"
        :template="templateWithDefaults"
        :item="element"
        @click="isEditDialogOpen = true"
      />
      <div class="spacer" />
      <v-icon class="clear-icon" name="delete" @click.stop="deleteNode" />
      <v-dialog v-model="isEditDialogOpen"
        ><v-card>{{ element }}</v-card></v-dialog
      >
    </div>
    <v-notice v-else type="warning">
      <span>{{ t("related_item_missing") }}</span>
      <div class="spacer"></div>
      <v-icon class="clear-icon" name="delete" @click.stop="deleteNode" />
    </v-notice>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { useRelationStore } from "../stores/relationStore";
import { computed, ref } from "vue";
import { useRelation } from "../composables/useRelation";
import { useI18nFallback } from "../composables/use-i18n-fallback";
import { useI18n } from "vue-i18n";

const props = defineProps<NodeViewProps>();

const { t } = useI18nFallback(useI18n());

const { templateWithDefaults, relation } = useRelation();

const relationStore = useRelationStore();

const element = computed(() => {
  const junctionItem = relationStore.allRelations.find((item) => props.node.attrs.id === item.id);
  if (!junctionItem) {
    return null;
  }

  // These look like they need to be in the format item_id: itemData
  // to render properly in the Directus render-template
  // E.g. ingredient_id: ServerIngredient, otherwise the render template will not work
  // and the inline text in the editor will be missing
  return {
    id: junctionItem.id,
    [junctionItem.relatedItem.junctionFieldName]: junctionItem.relatedItem.data,
  };
});

const isEditDialogOpen = ref(false);
</script>

<style scoped>
/* 
Based on the styles of
https://github.com/directus/directus/blob/main/app/src/components/v-list-item.vue
*/
.v-list-item {
  position: relative;
  display: flex;
  flex-basis: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  align-items: center;
  min-width: var(--v-list-item-min-width);
  max-width: var(--v-list-item-max-width);
  min-height: var(--v-list-item-min-height);
  max-height: var(--v-list-item-max-height);
  margin: var(--v-list-item-margin);
  padding: var(--v-list-item-padding);
  overflow: hidden;
  color: var(--theme--foreground, var(--v-list-item-color));
  text-decoration: none;
  border-radius: var(--theme--border-radius, var(--v-list-item-border-radius));
}

.v-list-item.link {
  cursor: pointer;
  transition: var(--fast) var(--transition);
  transition-property: background-color, color;
  user-select: none;
}

.v-list-item.link:not(.disabled):not(.block):hover {
  color: var(--v-list-item-color-hover);
  background-color: var(
    --theme--form--field--input--background,
    var(--v-list-item-background-color-hover)
  );
}

.v-list-item.link:not(.disabled):not(.block):active {
  color: var(--v-list-item-color-active);
  background-color: var(--v-list-item-background-color-active);
}

.v-list-item.active {
  color: var(--v-list-item-color-active);
  background-color: var(--v-list-item-background-color-active);
}

.v-list-item.disabled {
  --v-list-item-color: var(--theme--foreground-subdued, var(--foreground-subdued)) !important;
  cursor: not-allowed;
}

.v-list-item.block {
  --v-list-item-border-color: var(--theme--form--field--input--border-color, var(--border-subdued));
  --v-list-item-background-color: var(
    --theme--form--field--input--background,
    var(--background-page)
  );
  --v-list-item-background-color-hover: var(
    --theme--form--field--input--background,
    var(--card-face-color)
  );
  --v-icon-color: var(--theme--foreground-subdued, var(--foreground-subdued));

  position: relative;
  display: flex;
  height: var(--theme--form--field--input--height, var(--input-height));
  margin: 0;
  padding: 8px var(--theme--form--field--input--padding, var(--input-padding));
  background-color: var(--v-list-item-background-color);
  border: var(--theme--border-width, var(--border-width)) solid var(--v-list-item-border-color);
  border-radius: var(--theme--border-radius, var(--border-radius));
  transition: border-color var(--fast) var(--transition);
}

.v-list-item.block :slotted(.drag-handle) {
  cursor: grab;
}

.v-list-item.block :slotted(.drag-handle):hover {
  color: var(--theme--foreground, var(--foreground-normal));
}

.v-list-item.block :slotted(.drag-handle:active) {
  cursor: grabbing;
}

.v-list-item.block :slotted(.spacer) {
  flex-grow: 1;
}

.v-list-item.block.clickable:hover {
  background-color: var(
    --theme--form--field--input--background,
    var(--v-list-item-background-color-hover)
  );
  border: var(--theme--border-width, var(--border-width)) solid
    var(--theme--form--field--input--border-color-hover, var(--v-list-item-border-color-hover));
}

.v-list-item.block.sortable-chosen {
  border: var(--theme--border-width, var(--border-width)) solid
    var(--theme--primary, var(--primary)) !important;
}

.v-list-item.block.sortable-ghost {
  pointer-events: none;
}

.v-list-item.block + .v-list-item.block {
  margin-top: 8px;
}
</style>

<style scoped>
/* Custom styles */

.relation-block.ProseMirror-selectednode .v-list-item {
  border-color: var(--theme--primary);
}

.v-list-item:active {
  /* Alternative to sortable-chosen */
  border: var(--theme--border-width, var(--border-width)) solid
    var(--theme--primary, var(--primary)) !important;
}

.spacer {
  flex-grow: 1;
}

.collection {
  color: var(--theme--primary, var(--primary));
  white-space: nowrap;
  margin-right: 1ch;
}

.drag-handle {
  cursor: move;
  cursor: grab;
}

.drag-handle:hover {
  color: var(--theme--foreground, var(--foreground-normal));
}

.drag-handle:active {
  cursor: grabbing;
}

.clear-icon {
  --v-icon-color: var(--theme--foreground-subdued, var(--foreground-subdued));
  --v-icon-color-hover: var(--theme--danger, var(--danger));

  margin-right: 8px;
  color: var(--theme--foreground-subdued, var(--foreground-subdued));
  transition: color var(--fast) var(--transition);
  cursor: pointer;
}

.clear-icon:hover {
  color: var(--theme--danger, var(--danger));
}
</style>
