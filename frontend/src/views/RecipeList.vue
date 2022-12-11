<template>
  <div>
    <div>Recipe List</div>
    <div v-for="recipe in recipes" :key="recipe.slug">
      <a :href="'/recipes/' + recipe.slug">{{ recipe.title }}</a>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RecipeList",
  data() {
    return {
      recipes: [],
    };
  },
  created() {
    axios.get(import.meta.env.VITE_APIURL + "/api/recipes")
      .then((response) => {
        this.recipes = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
