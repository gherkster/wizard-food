import type { TranslateResult } from "vue-i18n";
import type { Collection as CollectionRaw, CollectionType } from "@directus/types";

export interface Collection extends CollectionRaw {
  name: string | TranslateResult;
  icon: string;
  type: CollectionType;
  color?: string | null;
}
