<template>
  <div></div>
</template>

<script>
import axios from "axios";

export default {
  name: "Recipe",
  data: () => ({
    recipe: null,
  }),
  async created() {
    await axios
      .get(process.env.VUE_APP_APIURL + "/api/recipes/" + this.$route.params.slug)
      .then((response) => {
        this.recipe = response.data;
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 400) {
          // TODO: Redirect to 404
        }
      });
  },
};
</script>

<style scoped>

</style>