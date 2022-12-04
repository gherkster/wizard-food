<template>
  <div id="app">
    <!-- TODO: Move to separate component -->
    <div class="nav-header">
      <n-menu mode="horizontal" :options="menuOptions" class="nav-header__menu" />
      <n-input :value="searchQuery" placeholder="Search" class="nav-header__search" @input="performSearch" />
    </div>
    <router-view />
    <alert-section />
  </div>
</template>

<script>
import { h } from "vue";
import { RouterLink } from "vue-router";
import AlertSection from "@/views/AlertSection.vue";
import { NInput, NMenu } from "naive-ui";

export default {
  name: "App",
  components: { AlertSection, NInput, NMenu },
  data() {
    return {
      searchQuery: "",
      searchResults: [
        { label: "something", value: "something" },
        { label: "something2", value: "something2" },
      ],
      menuOptions: [
        {
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: "home",
                },
              },
              { default: () => "Home" }
            ),
          key: "home",
        },
        {
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: "recipes",
                },
              },
              { default: () => "Recipes" }
            ),
        },
        {
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: "editor",
                },
              },
              { default: () => "New Recipe" }
            ),
        },
      ],
    };
  },
  methods: {
    performSearch(query) {
      this.searchQuery = query;
    },
  },
};
</script>

<style lang="scss">
@use "./styles/global.scss";
</style>
