<script setup lang="ts">
import { imageAspectRatio, type Image } from "@wizard/content";
import { css } from "styled-system/css";

const props = defineProps<{
  image: Image;
  lazy?: boolean;
  alt?: string;
}>();

const alt = props.alt ?? props.image.title;

/*
Set the height based on the final image aspect ratio to avoid CLS issues when loading
e.g. a 4:3 aspect ratio image should have a height which is 3/4 x width
*/
const { x, y } = imageAspectRatio;
</script>

<template>
  <div
    :class="css({ width: '100%', position: 'relative', overflow: 'hidden', borderRadius: 'sm' })"
    :style="{
      'aspect-ratio': `${x} / ${y}`,
    }"
  >
    <img
      v-if="image.base64ThumbnailUrl"
      :class="css({ filter: 'blur(20px)' })"
      :height="Math.round((image.width * y) / x)"
      :src="image.base64ThumbnailUrl"
      :width="image.width"
      alt=""
      aria-hidden
      role="presentation"
    />

    <img
      :alt="alt"
      :class="css({ position: 'absolute', display: 'block', inset: 0 })"
      :height="Math.round((image.width * y) / x)"
      :loading="lazy ? 'lazy' : undefined"
      :sizes="image.sizes"
      :src="image.src"
      :srcset="image.srcSet"
      :width="image.width"
    />
  </div>
</template>
