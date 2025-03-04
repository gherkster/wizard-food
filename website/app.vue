<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
  ],
});

const appConfig = useAppConfig();
const route = useRoute();

useServerHead({
  link: [
    {
      rel: "canonical",
      // Specify the URL without the query or hash as the canonical URL, to avoid duplicate page crawling issues with search query params.
      href: `${appConfig.externalBaseUrl}${route.path}`,
    },
  ],
});
</script>

<style lang="scss">
@use "./styles/index.scss";
</style>
