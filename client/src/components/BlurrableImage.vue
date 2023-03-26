<template>
  <div class="image-blurrable">
    <TransitionGroup name="blur">
      <!-- We can use X and Y aspect ratio values for height and width since we are using width 100% globally for img. This prevents
 cumulative layout shift (CLS) because the browser can calculate the area it should reserve based on the height/width aspect ratio -->
      <img
        class="blur"
        v-if="!isFullResImageLoaded"
        :src="thumbnailSrc"
        :key="thumbnailSrc"
        :height="image.aspectRatioY"
        :width="image.aspectRatioX"
      />
      <img
        v-show="isFullResImageLoaded"
        :src="fullResImageSrc"
        :key="fullResImageSrc"
        :height="image.aspectRatioY"
        :width="image.aspectRatioX"
        @load="swapToFullResImage"
      />
    </TransitionGroup>
  </div>
</template>

<!-- Display the blurred thumbnail initially while loading the full size image,
then swap when the full size image has loaded with a transition -->
<script setup lang="ts">
import { ref } from "vue";
import { ImageMeta } from "@/types/recipe";

const props = defineProps<{
  image: ImageMeta;
}>();

const imageSrcPath = `/media/images/${props.image.id}`;
const fullResImageSrc = `${imageSrcPath}/720.webp`; // TODO: Dynamic sizing
const thumbnailSrc = `${imageSrcPath}/thumb.webp`;

const isFullResImageLoaded = ref(false);

function swapToFullResImage() {
  isFullResImageLoaded.value = true;
}
</script>

<style lang="scss" scoped>
.image-blurrable {
  width: 100%;
  overflow: hidden;
  position: relative;
}
.blur {
  filter: blur(6px);
}
.blur-leave-active {
  transition: opacity 0.4s linear;
  position: absolute;
}
.blur-leave-to {
  opacity: 0;
}
</style>
