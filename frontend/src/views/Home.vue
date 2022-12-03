<template>
  <div>
    <p>Recipe List</p>
    <n-button @click="goToEditor">Go to editor</n-button>
    <n-button @click="goToSearch">Go to search</n-button>
    <n-button @click="goToTestRecipe">Go to recipe</n-button>
  </div>
</template>

<script>
import { NButton } from "naive-ui";
export default {
  name: "Home",
  components: { NButton },
  methods: {
    goToEditor() {
      this.$router.push("/editor");
    },
    goToSearch() {
      this.$router.push("/recipes");
    },
    goToTestRecipe() {
      this.$router.push("/recipes/banh-mi");
    },
  },
};
</script>

<style scoped></style>
