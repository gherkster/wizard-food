<template>
  <div id="app">
    <!-- TODO: Move to separate component -->
    <div class="nav-header">
      <n-menu mode="horizontal" :options="menuOptions" class="nav-header__menu" />
      <n-input :value="searchQuery" placeholder="Search" class="nav-header__search" @input="performSearch" />
      <font-awesome-icon icon="fa-solid fa-user" size="xl" class="nav-header__login" @click="goToLogin" />
    </div>
    <n-dialog-provider>
      <router-view />
    </n-dialog-provider>
    <alert-section />
  </div>
</template>

<script>
import { h } from "vue";
import { RouterLink } from "vue-router";
import AlertSection from "@/views/AlertSection.vue";
import { NDialogProvider, NInput, NMenu } from "naive-ui";

export default {
  name: "App",
  components: { AlertSection, NDialogProvider, NInput, NMenu },
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
          key: "recipes",
        },
        {
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: "new-recipe",
                },
              },
              { default: () => "New Recipe" }
            ),
          key: "new-recipe",
        },
      ],
    };
  },
  methods: {
    performSearch(query) {
      this.searchQuery = query;
    },
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss">
@use "./styles/global.scss";
</style>
