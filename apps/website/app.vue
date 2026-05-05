<script setup lang="ts">
import { useSearch } from "./composables/useSearch";

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

if (import.meta.server) {
  useHead({
    link: [
      {
        rel: "canonical",
        // Specify the URL without the query or hash as the canonical URL, to avoid duplicate page crawling issues with search query params.
        href: `${appConfig.externalBaseUrl}${route.path}`,
      },
    ],
  });
}

if (import.meta.env.DEV) {
  // Refresh the search index in local dev, to avoid a stale search index if the handling logic around it has changed
  void useSearch().refreshIndex();
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
