<template>
  <div>
    <p>Recipe List</p>
    <button @click="goToEditor">Go to editor</button>
  </div>
</template>

<script>
export default {
  name: "RecipeList",
  components: { },
  methods: {
    goToEditor() {
      this.$router.push("/editor");
    },
  },
};
</script>

<style scoped></style>
