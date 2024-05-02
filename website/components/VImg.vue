<template>
  <img :src="src" :alt="img.title" :width="props.img.width" :height="props.img.height" />
</template>

<script setup lang="ts">
import type { Image } from "~/types/recipe";
import type { ImagePurpose } from "~/types/image";

const props = defineProps<{
  img: Image;
  purpose: ImagePurpose;
  thumbnail?: boolean;
}>();

const image = useImage();
const src = image.buildRelativeUrl({
  imageId: props.img.id,
  modifyDate: props.img.modifyDate,
  purpose: props.purpose,
  thumbnail: props.thumbnail,
});
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as v;
img {
  display: block;
  border-radius: v.$border-radius-sm;
}
</style>
