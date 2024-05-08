<template>
  <nuxt-layout>
    <div class="center-screen">
      <h2>{{ errorMessage }}</h2>
      <v-button size="large" @click="handleError">Home</v-button>
    </div>
  </nuxt-layout>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";
const props = defineProps<{
  error: NuxtError;
}>();
const errorMessage = computed(() =>
  props.error.statusCode === 404 ? "Page not found! 🙃" : "Something went wrong! 😤",
);
// TODO: Does this need to be logged on the server?
console.error(props.error);
const handleError = () => clearError({ redirect: "/" });
</script>
