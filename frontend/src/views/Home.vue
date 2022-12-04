<template>
  <div>
    <p>Home</p>
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
