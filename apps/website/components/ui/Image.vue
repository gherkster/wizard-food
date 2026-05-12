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

const containerCss = css({
  position: "relative",
  overflow: "hidden",
  aspectRatio: `${x} / ${y}`,
  width: "100%",
  height: "100%",
  backgroundColor: "transparent",

  // Display the blurred thumbnail image in the container while the image is loading
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    zIndex: 0,
    backgroundImage: "var(--thumbnail)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "blur(12px)",
    transform: "scale(1.1)", // Hide the feathered edges
  },
});

const imageCss = css({
  backgroundColor: "transparent",
  color: "transparent",
  fontSize: "0",
  display: "block",
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "cover",
  // Start invisible to hide scanlines/white background
  opacity: 0,
  position: "relative",
});
</script>

<template>
  <div
    :class="containerCss"
    :style="{
      '--thumbnail': image.base64ThumbnailUrl ? `url(${image.base64ThumbnailUrl})` : undefined,
    }"
    class="image-container"
  >
    <img
      :alt="alt || image.title"
      :class="imageCss"
      :height="Math.round((image.width * y) / x)"
      :loading="lazy ? 'lazy' : undefined"
      v-bind="{
        /**
         * onload is used to have an inline script delivered over html that runs before the js is loaded,
         * ensuring the thumbnail blur effect is removed as soon as possible.
         *
         * The :src is specified after the onload property, not sure if
         * this is actually needed but this is the order it needs to be done in
         * when creating an img tag in javascript so that cached images also fire the event.
         **/
        onload: 'this.style.opacity = 1; this.onload = null;',
      }"
      :src="image.src"
      :srcset="image.srcSet"
      :sizes="image.sizes"
      :width="image.width"
    />
  </div>
</template>
