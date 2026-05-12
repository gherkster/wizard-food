<script setup lang="ts">
import type { Image } from "@wizard/content";
import { css } from "styled-system/css";

import type { RouteLocationRaw } from "#vue-router";

interface Props {
  description?: string;
  duration: string | undefined;
  image: Image;
  orientation?: "horizontal" | "vertical";
  tag: string | undefined;
  title: string;
  to: RouteLocationRaw;
}

withDefaults(defineProps<Props>(), {
  orientation: "vertical",
});

const contentStyles = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "xs",
  padding: "xs",
});
</script>

<template>
  <Card :image="image" :orientation="orientation" :to="to">
    <div :class="contentStyles">
      <Text size="xl" weight="bold">{{ title }}</Text>
      <Text v-if="description" class="card-description">{{ description }}</Text>

      <div v-if="duration || tag" :class="css({ display: 'flex', gap: '10px' })">
        <Text v-if="tag" size="sm">{{ tag }}</Text>
        <DotSeparator v-if="duration && tag" />
        <Text v-if="duration" size="sm" :class="css({ textTransform: 'uppercase' })">{{
          duration
        }}</Text>
      </div>
    </div>
  </Card>
</template>
