<script setup lang="ts">
import { getAspectRatio, type Image, type ImagePurpose, type ImageShape } from "@wizard/content";
import { css } from "styled-system/css";

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
    shape: ImageShape;
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

const { x, y } = getAspectRatio(props.shape);
</script>

<template>
  <div
    :class="css({ width: '100%', position: 'relative', overflow: 'hidden', borderRadius: 'sm' })"
    :style="`aspect-ratio: ${x} / ${y}`"
  >
    <VImg
      v-if="img.metadata?.base64Url"
      :class="css({ filter: 'blur(20px)' })"
      :img="img"
      :purpose="purpose"
      :shape="shape"
      thumbnail
      alt=""
      ariaHidden="true"
      role="presentation"
    />
    <VImg
      :class="css({ position: 'absolute', inset: 0 })"
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
