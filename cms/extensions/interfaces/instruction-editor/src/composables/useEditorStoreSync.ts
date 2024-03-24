import { Editor, NodeWithPos } from "@tiptap/core";
import { useRelationStore } from "../stores/relationStore";
import { tagName } from "../nodes/inline-relation";

export function useEditorStoreSync() {
  const store = useRelationStore();

  function getExistingInlineNodes(editor: Editor) {
    const inlineNodes: NodeWithPos[] = [];

    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === tagName) {
        inlineNodes.push({ node, pos });
      }
    });

    return inlineNodes;
  }

  function syncRemovedNodes(currentNodeIds: Set<string>) {
    const removedPreExistingItems = store.preExistingRelations
      .map((pe) => pe.id)
      .filter((id) => !currentNodeIds.has(id));

    removedPreExistingItems.forEach((id) => {
      if (store.stagedChanges.delete.includes(id)) {
        return; // If item is already staged for deletion then no further updates are required
      } else {
        store.stagedChanges.delete.push(id);
      }
    });

    // Items staged for creation just need to be moved from staging to inactive to handle removal
    const removedStagedItemCreations = store.stagedChanges.create.filter((c) => !currentNodeIds.has(c.id));
    removedStagedItemCreations.forEach((item) => {
      store.inactiveChanges.set(item.id, item);
    });

    store.stagedChanges.create = store.stagedChanges.create.filter((c) => currentNodeIds.has(c.id));
  }

  function syncRestoredNodes(currentNodeIds: string[]) {
    // Remove any staged deletions matching with a new node
    // This is only relevant for preexisting relations which delete was clicked
    // and then afterwards restored using redo/copy paste etc
    // In this scenario the item is retained in the preexisting relation store list so there is nothing else to do
    const restoredPreExistingNodes = currentNodeIds.filter((id) => store.stagedChanges.delete.includes(id));
    store.stagedChanges.delete = store.stagedChanges.delete.filter(
      (d) => !restoredPreExistingNodes.includes(d.toString()),
    );

    // Move any new items found in the inactive collection into the item creation staging
    // This is only relevant for newly created relations which were staged, then removed afterwards
    // If the user then hits redo, the previously created relation should be reused
    const newNodeIds = currentNodeIds.filter((id) => !store.allRelations.map((r) => r.id).includes(id));
    store.inactiveChanges.forEach((change, id) => {
      if (!newNodeIds.includes(id)) {
        return;
      }

      store.inactiveChanges.delete(id);
      store.stagedChanges.create.push(change);
    });
  }

  function syncEditorWithRelationChanges(editor: Editor) {
    const nodes = getExistingInlineNodes(editor);
    const currentNodeIds = nodes.map(({ node }) => node.attrs.id as string);

    // Staging of new items is already handled on insertion where the relationship data is already retrieved
    syncRemovedNodes(new Set(currentNodeIds));
    syncRestoredNodes(currentNodeIds);
  }

  return {
    syncEditorWithRelationChanges,
  };
}
