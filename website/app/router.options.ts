import type { RouterConfig } from "nuxt/schema";

export default <RouterConfig>{
  /*
  Fix issue where clicking on a link further down the page would:
  1. Navigate to the new page at the current scroll position
  2. Jump to the top, resulting in a flash of content from the middle before the top was displayed
  */
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();

    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce("page:finish", async () => {
        await nextTick();
        /*
        Clicking back/forward in the browser should return to the previous position,
        while clicking on a link should start at the top
        */
        if (savedPosition) {
          resolve(savedPosition);
          return;
        }

        resolve({
          top: 0,
          behavior: "auto",
        });
      });
    });
  },
};
