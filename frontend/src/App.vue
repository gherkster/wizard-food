<template>
  <div id="app">
    <n-config-provider inline-theme-disabled>
      <app-header />
      <n-dialog-provider>
        <router-view />
      </n-dialog-provider>
      <alert-section />
    </n-config-provider>
  </div>
</template>

<script>
import AlertSection from "@/views/AlertSection.vue";
import AppHeader from "@/views/AppHeader.vue";
import { NDialogProvider, NConfigProvider } from "naive-ui";

export default {
  name: "App",
  components: { AppHeader, AlertSection, NDialogProvider, NConfigProvider },
};
</script>

<style lang="scss">
@use "./styles/global.scss";
</style>
