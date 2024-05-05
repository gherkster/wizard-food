<template>
  <img :src="src" :alt="img.title" :width="props.img.width" :height="adjustedHeight" />
</template>

<script setup lang="ts">
import type { Image } from "~/types/recipe";
import type { AspectRatio, ImagePurpose } from "~/types/image";

const props = defineProps<{
  img: Image;
  purpose: ImagePurpose;
  aspectRatio: AspectRatio;
  thumbnail?: boolean;
}>();

const image = useImage();
const src = image.buildRelativeUrl({
  imageId: props.img.id,
  modifyDate: props.img.modifyDate,
  purpose: props.purpose,
  aspectRatio: props.aspectRatio,
  thumbnail: props.thumbnail,
});

/*
Set the height based on the final image aspect ratio to avoid CLS issues when loading
e.g. a 3:4 aspect ratio image should have a height which is 4/3 x width
*/
const { x, y } = image.getAspectRatio(props.aspectRatio);
const adjustedHeight = Math.round((props.img.width * y) / x);
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as v;
img {
  display: block;
}
</style>
