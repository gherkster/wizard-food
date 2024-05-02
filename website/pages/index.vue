<template>
  <div>
    <h2>Latest Recipes</h2>
    <h2>Personal Favourites</h2>
    <h2>Fast (and Fancy)</h2>
    <h2>World Cuisines</h2>
  </div>
</template>

<script setup lang="ts">
const recipesResponse = await useAsyncData(async () => {
  const { data: response } = await useFetch("/api/featured-recipes");
  return response.value;
});

console.log(recipesResponse.data.value);

const firstRecipe = recipesResponse.data.value!.latest[0];
const date = new Date(firstRecipe.date_created);
console.log(firstRecipe.date_created, date);

</script>
