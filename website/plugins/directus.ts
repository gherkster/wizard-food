import { createDirectus, readItems, rest } from "@directus/sdk";
import { CmsSchema } from "~/composables/useDirectus";

const directus = createDirectus<CmsSchema>("https://cms.server.patrickbenter.com").with(rest());

export default defineNuxtPlugin(() => {
  return {
    provide: {
      directus,
      readItems,
    },
  };
});
