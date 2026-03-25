<template>
  <div class="image-container" :style="`aspect-ratio: ${x} / ${y}`">
    <v-img
      v-if="img.metadata?.base64Url"
      class="blur"
      :img="img"
      :purpose="purpose"
      :aspect-ratio="aspectRatio"
      thumbnail
      alt=""
      aria-hidden="true"
      role="presentation"
    />
    <!-- noscript always results in hydration mismatch with Vue SSR -->
    <noscript>
      <v-img
        class="image"
        :lazy="lazy"
        :img="img"
        :purpose="purpose"
        :aspect-ratio="aspectRatio"
        :alt="alt"
        :aria-hidden="ariaHidden"
        :role="role"
      />
    </noscript>
    <v-img
      class="image"
      :img="img"
      :purpose="purpose"
      :aspect-ratio="aspectRatio"
      :lazy="lazy"
      :alt="alt"
      :aria-hidden="ariaHidden"
      :role="role"
    />
  </div>
</template>

<script setup lang="ts">
import type { AspectRatio, Image, ImagePurpose } from "@wizard/content/store";

import { useImage } from "@/composables/useImage";

import VImg from "./VImg.vue";

/*
We can use X and Y aspect ratio values for height and width since we are using width 100% globally for img.
This prevents cumulative layout shift (CLS) because the browser can calculate the area it should reserve
based on the height/width aspect ratio.

The image is loaded by initially displaying the inline base64 hashed thumbnail URL, and simultaneously lazy-loading the full size image,
which is made visible over the top of the blurred thumbnail image once it has loaded.
Critically, the full size image does not block the page load while it loads.
 */
const props = withDefaults(
  defineProps<{
    img: Image;
    purpose: ImagePurpose;
    aspectRatio: AspectRatio;
    lazy?: boolean;
    alt?: string;
    role?: string;
    ariaHidden?: boolean | "true" | "false";
  }>(),
  {
    lazy: false,
    alt: "",
    role: "",
    ariaHidden: false,
  },
);

const { x, y } = useImage().getAspectRatio(props.aspectRatio);
</script>

<style lang="scss">
@use "../styles/variables" as v;

.image-container {
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: v.$border-radius-sm;

  .image {
    position: absolute;
    inset: 0;
  }

  .blur {
    filter: blur(20px);
  }
}
</style>
