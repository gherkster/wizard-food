<script setup lang="ts">
import { center } from "styled-system/patterns";

import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const errorMessage = computed(() =>
  props.error.status === 404 ? "Page not found! 🙃" : "Something went wrong! 😤",
);

console.error(props.error);

const handleError = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtLayout>
    <div
      :class="
        center({
          display: 'flex',
          flexDirection: 'column',
          w: '100%',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        })
      "
    >
      <h2>{{ errorMessage }}</h2>
      <Button @click="handleError">
        <Text size="xl">Go home</Text>
      </Button>
    </div>
  </NuxtLayout>
</template>
