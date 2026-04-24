<script setup lang="ts">
import { center } from "styled-system/patterns";

import type { NuxtError } from "#app";

import VButton from "./components/VButton.vue";

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
  <nuxt-layout>
    <div
      :class="
        center({
          w: '100%',
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        })
      "
    >
      <h2>{{ errorMessage }}</h2>
      <VButton size="large" @click="handleError">Home</VButton>
    </div>
  </nuxt-layout>
</template>
