<template>
  <div class="nav-header">
    <n-menu mode="horizontal" :options="menuOptions" class="nav-header__menu" />
    <n-input :value="searchQuery" placeholder="Search" class="nav-header__search" @input="performSearch" />
  </div>
</template>

<script>
import { NInput, NMenu } from "naive-ui";
import { h } from "vue";
import { RouterLink } from "vue-router";
import { useUserStore } from "@/store/userStore";

export default {
  name: "AppHeader",
  components: {
    NInput,
    NMenu,
  },
  setup() {
    const userStore = useUserStore();
    return {
      userStore,
    };
  },
  data() {
    return {
      searchQuery: "",
      searchResults: [
        { label: "something", value: "something" },
        { label: "something2", value: "something2" },
      ],
      homeLink: {
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
      recipesLink: {
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
      newRecipeLink: {
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
    };
  },
  computed: {
    menuOptions() {
      const options = [];

      options.push(this.homeLink);
      options.push(this.recipesLink);
      if (this.userStore.isAuthenticated) {
        // Only an admin can create new recipes
        options.push(this.newRecipeLink);
      }

      return options;
    },
  },
  methods: {
    performSearch(query) {
      this.searchQuery = query;
    },
  },
};
</script>
