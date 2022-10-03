<template>
  <div>
    <p>Recipe List</p>
    <input-button @click="goToEditor">Go to editor</input-button>
    <input-button @click="goToSearch">Go to search</input-button>
    <input-button @click="goToTestRecipe">Go to recipe</input-button>
  </div>
</template>

<script>
import InputButton from "@/components/atoms/VButton.vue";
export default {
  name: "Home",
  components: { InputButton },
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
