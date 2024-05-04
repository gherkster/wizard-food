<template>
  <div class="home">
    <section v-if="latestRecipes.length > 0">
      <h2>Latest Recipes</h2>
      <div class="featured-recipe-list">
        <recipe-preview v-for="recipe in latestRecipes" :key="recipe.slug" :recipe="recipe" />
      </div>
    </section>
    <section v-if="favouriteRecipes.length > 0">
      <h2>Personal Favourites</h2>
      <div class="featured-recipe-list">
        <recipe-preview v-for="recipe in favouriteRecipes" :key="recipe.slug" :recipe="recipe" />
      </div>
    </section>
    <section v-if="quickRecipes.length > 0">
      <h2>Quick Eats</h2>
      <div class="featured-recipe-list">
        <recipe-preview v-for="recipe in quickRecipes" :key="recipe.slug" :recipe="recipe" />
      </div>
    </section>
    <section v-if="worldCuisineRecipes.length > 0">
      <h2>World Cuisines</h2>
      <div class="featured-recipe-list">
        <recipe-preview v-for="recipe in worldCuisineRecipes" :key="recipe.slug" :recipe="recipe" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const recipesResponse = await useAsyncData(async () => {
  const { data: response } = await useFetch("/api/featured-recipes");
  return response.value;
});

if (recipesResponse.error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: recipesResponse.error.value?.message,
  });
}

if (!recipesResponse.data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found!",
  });
}

const latestRecipes = ref(
  recipesResponse.data.value.latestRecipes
    .concat(recipesResponse.data.value.latestRecipes)
    .concat(recipesResponse.data.value.latestRecipes),
);
const favouriteRecipes = ref(
  recipesResponse.data.value.favouriteRecipes
    .concat(recipesResponse.data.value.favouriteRecipes)
    .concat(recipesResponse.data.value.favouriteRecipes),
);
const quickRecipes = ref(
  recipesResponse.data.value.quickRecipes
    .concat(recipesResponse.data.value.quickRecipes)
    .concat(recipesResponse.data.value.quickRecipes),
);
const worldCuisineRecipes = ref(
  recipesResponse.data.value.worldCuisineRecipes
    .concat(recipesResponse.data.value.worldCuisineRecipes)
    .concat(recipesResponse.data.value.worldCuisineRecipes),
);
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;

.home {
  display: flex;
  flex-direction: column;
  @include m.spacing("gy", "lg");
  .featured-recipe-list {
    display: grid;
    @include m.spacing("g", "sm");
    @include m.breakpoint("xs") {
      grid-template-columns: repeat(2, 1fr);
      > *:first-child {
        grid-column: 1 / 3;
      }
    }
    @include m.breakpoint("sm") {
      grid-template-columns: repeat(3, 1fr);
      > *:first-child {
        grid-column: unset;
      }
    }
    @include m.breakpoint("md") {
      grid-template-columns: repeat(3, 1fr);
      > *:first-child {
        grid-column: unset;
      }
    }
  }
}
</style>
