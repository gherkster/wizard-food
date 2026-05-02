<script setup lang="ts">
import type { Image } from "@wizard/content";
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

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
  <Card :image="image" orientation="vertical" :to="to">
    <div
      :class="
        css({
          display: 'flex',
          flexDirection: 'column',
          gap: token('spacing.xxs'),
          marginTop: 'xxs',
        })
      "
    >
      <Text size="lg" weight="bold">{{ title }}</Text>
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
