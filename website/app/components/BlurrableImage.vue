<template>
  <div class="image-container" :style="`aspect-ratio: ${x} / ${y}`">
    <v-img
      v-if="img.metadata?.base64Url"
      class="blur"
      :img="img"
      :purpose="purpose"
      :aspect-ratio="aspectRatio"
      thumbnail
    />
    <!-- noscript always results in hydration mismatch with Vue SSR -->
    <noscript data-allow-mismatch>
      <v-img class="image" :lazy="lazy" :img="img" :purpose="purpose" :aspect-ratio="aspectRatio" />
    </noscript>
    <v-img
      ref="fullSizeImageRef"
      class="image"
      :img="img"
      :purpose="purpose"
      :aspect-ratio="aspectRatio"
      :lazy="lazy"
      :title="img.title"
    />
  </div>
</template>

<script setup lang="ts">
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
  }>(),
  {
    lazy: false,
  },
);

const fullSizeImageRef = useTemplateRef("fullSizeImageRef");

onMounted(() => {
  if (props.img.metadata?.base64Url && fullSizeImageRef.value?.img) {
    // If the image is already complete when mounting then don't show the animation. This likely means the image was already in the browser memory cache.
    if (fullSizeImageRef.value.img.complete) {
      return;
    }

    setTimeout(() => {
      // Check again after 5ms, which should be long enough for the browser disk cache to have completed.
      if (fullSizeImageRef.value.img.complete) {
        return;
      }

      // If the image still isn't ready by now, either because it's a fresh image or slower cache, then hide the image while it loads to display the blurred thumbnail preview.
      fullSizeImageRef.value.img.classList.add("hidden");
      fullSizeImageRef.value.img.onload = () => {
        fullSizeImageRef.value?.img?.classList.remove("hidden");
      };
    }, 5);
  }
});

const { x, y } = useImage().getAspectRatio(props.aspectRatio);
</script>

<style lang="scss">
@use "@/styles/variables" as v;

.image-container {
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: v.$border-radius-sm;

  .image {
    position: absolute;
    inset: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .image.hidden {
    opacity: 0;
  }

  .blur {
    filter: blur(20px);
  }
}
</style>
