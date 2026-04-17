import type { Collection as CollectionRaw, CollectionType } from "@directus/types";

export interface Collection extends CollectionRaw {
  name: string;
  icon: string;
  type: CollectionType;
  color?: string | null;
}
