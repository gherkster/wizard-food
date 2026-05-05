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
  <nuxt-layout>
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
      <HoverLink to="/" @click.prevent="handleError">
        <Text size="xl">Go home</Text>
      </HoverLink>
    </div>
  </nuxt-layout>
</template>
