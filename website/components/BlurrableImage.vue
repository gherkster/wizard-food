<template>
  <div class="image-container">
    <v-img class="blur" :img="img" :purpose="purpose" thumbnail />
    <v-img
      class="image--full hidden"
      onload="this.classList.remove('hidden')"
      loading="lazy"
      :img="img"
      :purpose="purpose"
    />
  </div>
</template>

<script setup lang="ts">
/*
We can use X and Y aspect ratio values for height and width since we are using width 100% globally for img.
This prevents cumulative layout shift (CLS) because the browser can calculate the area it should reserve
based on the height/width aspect ratio.

The image is loaded by loading the blurred thumbnail and simultaneously lazy-loading the full size image,
which is made visible over the top of the blurred thumbnail image once it has loaded.
Critically, the full size image does not block the page load while it loads.

The benefit of this is that a previously cached image will load so quickly that subsequent page loads
should not cause any flickering, as the inline onload script can run before the rest of the javascript is loaded.
 */

import type { ImagePurpose } from "~/types/image";
import type { Image } from "~/types/recipe";

defineProps<{
  img: Image;
  purpose: ImagePurpose;
}>();
</script>

<style lang="scss">
.image-container {
  width: 100%;
  position: relative;
  overflow: hidden;

  .image--full {
    position: absolute;
    inset: 0;
    opacity: 1;
    transition: all 0.3s linear;
  }
  // TODO: Confine the blur to inside the image area, don't spill over the border
  .image--full.hidden {
    filter: blur(2px);
    opacity: 0;
  }
  .blur {
    filter: blur(2px);
  }
}
</style>
