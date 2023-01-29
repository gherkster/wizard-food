<template>
  <div>
    <div>Recipe List</div>
    <div v-for="recipe in recipes" :key="recipe.slug">
      <a @click="goToRecipe(recipe.slug)">{{ recipe.title }}</a>
    </div>
  </div>
</template>

<script>
import apis from "@/constants/apis";
import { useAxios } from "@/composables";

export default {
  name: "RecipeList",
  setup() {
    return {
      axios: useAxios(),
    };
  },
  data() {
    return {
      recipes: [],
    };
  },
  created() {
    this.axios
      .get(apis.recipes)
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
