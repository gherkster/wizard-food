<template>
  <div>
    <p>Recipe List</p>
    <v-btn @click="goToEditor">Go to editor</v-btn>
    <v-btn @click="goToSearch">Go to search</v-btn>
    <v-btn @click="goToTestRecipe">Go to recipe</v-btn>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
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
