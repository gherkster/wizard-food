<template>
  <Suspense @fallback="startLoadingBar" @resolve="stopLoadingBar">
    <router-view />
  </Suspense>
</template>

<script>
import { useLoadingBar } from "naive-ui";

export default {
  name: "PageView",
  setup() {
    const loadingBar = useLoadingBar();
    return {
      loadingBar,
    };
  },
  methods: {
    startLoadingBar() {
      this.loadingBar.start();
    },
    stopLoadingBar() {
      this.loadingBar.finish();
    },
  },
};
</script>
