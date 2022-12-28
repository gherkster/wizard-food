<template>
  <div id="app">
    <app-header />
    <n-dialog-provider>
      <router-view />
    </n-dialog-provider>
    <alert-section />
  </div>
</template>

<script>
import AlertSection from "@/views/AlertSection.vue";
import AppHeader from "@/views/AppHeader.vue";
import { NDialogProvider } from "naive-ui";

export default {
  name: "App",
  components: { AppHeader, AlertSection, NDialogProvider },
};
</script>

<style lang="scss">
@use "./styles/global.scss";
</style>
