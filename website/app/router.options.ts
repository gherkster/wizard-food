import type { RouterConfig } from "nuxt/schema";

export default <RouterConfig>{
  /*
  Fix issue where clicking on a link further down the page would:
  1. Navigate to the new page at the current scroll position
  2. Jump to the top, resulting in a flash of content from the middle before the top was displayed
  */
  scrollBehavior() {
    const nuxtApp = useNuxtApp();

    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce("page:finish", async () => {
        await nextTick();
        resolve({
          top: 0,
          behavior: "instant",
        });
      });
    });
  },
};
