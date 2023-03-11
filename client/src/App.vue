<template>
  <div id="app">
    <n-config-provider inline-theme-disabled :theme-overrides="overrides">
      <app-header />
      <n-dialog-provider>
        <n-theme-editor>
          <n-loading-bar-provider>
            <page-view />
          </n-loading-bar-provider>
        </n-theme-editor>
      </n-dialog-provider>
      <alert-section />
    </n-config-provider>
  </div>
</template>

<script>
import AlertSection from "@/views/AlertSection.vue";
import AppHeader from "@/views/AppHeader.vue";
import { NDialogProvider, NConfigProvider, NThemeEditor, NLoadingBarProvider } from "naive-ui";
import overrides from "@/theme/overrides";
import PageView from "@/views/PageView.vue";

export default {
  name: "App",
  components: { PageView, AppHeader, AlertSection, NDialogProvider, NConfigProvider, NThemeEditor, NLoadingBarProvider },
  setup() {
    console.log(overrides);
    return {
      overrides,
    };
  },
};
</script>

<style lang="scss">
@use "./styles/global.scss";
</style>
