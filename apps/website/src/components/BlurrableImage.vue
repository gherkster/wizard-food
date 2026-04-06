<script setup lang="ts">
import type { Image, ImagePurpose, ImageShape } from "@wizard/content/store";

import VImg from "./VImg.vue";

interface Props {
  img: Image;
  purpose: ImagePurpose;
  shape: ImageShape;
  lazy?: boolean;
  alt?: string;
  ariaHidden?: boolean;
  role?: string;
}

/*
We can use X and Y aspect ratio values for height and width since we are using width 100% globally for img.
This prevents cumulative layout shift (CLS) because the browser can calculate the area it should reserve
based on the height/width aspect ratio.

The image is loaded by initially displaying the inline base64 hashed thumbnail URL, and simultaneously lazy-loading the full size image,
which is made visible over the top of the blurred thumbnail image once it has loaded.
Critically, the full size image does not block the page load while it loads.
 */
const props = withDefaults(defineProps<Props>(), {
  lazy: false,
  alt: "",
  role: "",
  ariaHidden: false,
});

const variant = props.img.variants[props.purpose][props.shape];
</script>

<template>
  <div
    class="image-container"
    :style="`aspect-ratio: ${variant.aspectRatio.x} / ${variant.aspectRatio.y}`"
  >
    <v-img
      v-if="img.metadata?.base64Url"
      class="blur"
      :img="img"
      :purpose="purpose"
      :shape="shape"
      thumbnail
      alt=""
      role="presentation"
      ariaHidden
    />
    <v-img
      class="image"
      :img="img"
      :purpose="purpose"
      :shape="shape"
      :lazy="lazy"
      :alt="alt"
      :ariaHidden="ariaHidden"
      :role="role"
    />
  </div>
</template>

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
