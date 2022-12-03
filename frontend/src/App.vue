<template>
  <div id="app">
    <n-layout>
      <n-layout-header bordered>
        Header
      </n-layout-header>
      <n-layout-content>
        <router-view />
      </n-layout-content>
      <n-layout-footer>
        Footer
      </n-layout-footer>
    </n-layout>
    <alert-section />
  </div>
</template>

<script>
import AlertSection from "@/views/AlertSection.vue";
import { NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter } from "naive-ui";
export default {
  name: "App",
  components: { AlertSection, NLayout, NLayoutHeader, NLayoutContent, NLayoutFooter },
};
</script>

<style lang="scss">
@use "./styles/global.scss";
</style>
