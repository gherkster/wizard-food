<template>
  <div>
    <h1>{{ global.title }}</h1>
    <h2>{{ global.description }}</h2>
  </div>
</template>

<script setup lang="ts">
//const { $directus, $readItems } = useNuxtApp();

// const response = await useAsyncData("global", () => {
//   return $directus.request(
//     $readItems("global"));
// });
// const globalData = response.data;
//
// if (!globalData.value) {
//   throw createError({
//     statusCode: 404,
//     statusMessage: "Page not found",
//   });
// }
// const global = ref(globalData.value!);
const global = {
  title: "",
  description: "howdy",
};
</script>
