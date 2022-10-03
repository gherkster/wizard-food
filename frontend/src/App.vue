<template>
  <div id="app">
    <router-view />
    <alert-section />
  </div>
</template>

<script>
import AlertSection from "@/views/AlertSection.vue";
export default {
  name: "App",
  components: { AlertSection },
};
</script>

<style lang="scss">
@use "./styles/global.scss";
</style>
