<template>
  <div>
    <p>Recipe List</p>
    <v-btn @click="goToEditor">Go to editor</v-btn>
  </div>
</template>

<script>
export default {
  name: "RecipeList",
  components: {},
  methods: {
    goToEditor() {
      this.$router.push("/editor");
    },
  },
};
</script>

<style scoped></style>
