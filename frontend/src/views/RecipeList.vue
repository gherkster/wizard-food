<template>
  <div>
    <div>Recipe List</div>
    <div v-for="recipe in recipes" :key="recipe.slug">
      <a @click="goToRecipe(recipe.slug)">{{ recipe.title }}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeList",
  data() {
    return {
      recipes: [],
    };
  },
  created() {
    this.$axios
      .get(import.meta.env.VITE_APIURL + "/api/recipes")
      .then((response) => {
        this.recipes = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    goToRecipe(slug) {
      this.$router.push("/recipes/" + slug);
    },
  },
};
</script>
