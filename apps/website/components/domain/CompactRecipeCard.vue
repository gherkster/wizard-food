<script setup lang="ts">
import type { Image } from "@wizard/content";

import type { RouteLocationRaw } from "#vue-router";

interface Props {
  title: string;
  image: Image;
  duration: string | undefined;
  tag: string | undefined;
  to: RouteLocationRaw;
}

defineProps<Props>();
</script>

<template>
  <Card :image="image" orientation="horizontal" :to="to">
    <div>
      <p>{{ title }}</p>
      <div v-if="tag || duration">
        <span v-if="tag">{{ tag }}</span>
        <span v-if="duration">{{ duration }}</span>
      </div>
    </div>
  </Card>
</template>
