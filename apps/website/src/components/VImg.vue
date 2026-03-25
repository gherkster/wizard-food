<template>
  <img
    ref="imgRef"
    :src="src"
    :srcset="thumbnail ? undefined : variant.srcSet"
    :sizes="thumbnail ? undefined : variant.sizes"
    :alt="alt"
    :aria-hidden="ariaHidden"
    :role="role"
    :width="img.width"
    :height="adjustedHeight"
    :loading="lazy ? 'lazy' : undefined"
  />
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";
import type { AspectRatio, Image, ImagePurpose } from "@wizard/content/store";

import { useImage } from "@/composables/useImage";

const props = defineProps<{
  img: Image;
  purpose: ImagePurpose;
  aspectRatio: AspectRatio;
  thumbnail?: boolean;
  lazy?: boolean;
  alt?: string;
  role?: string;
  ariaHidden?: boolean | "true" | "false";
}>();

const imgRef = useTemplateRef("imgRef");

defineExpose({
  img: imgRef,
});

const image = useImage();
const variant = image.getVariant(props.img, props.purpose, props.aspectRatio);

const src =
  props.thumbnail && props.img.metadata?.base64Url ? props.img.metadata.base64Url : variant.src;

const alt = props.alt ?? (props.thumbnail ? "" : props.img.title);

/*
Set the height based on the final image aspect ratio to avoid CLS issues when loading
e.g. a 3:4 aspect ratio image should have a height which is 4/3 x width
*/
const { x, y } = image.getAspectRatio(props.aspectRatio);
const adjustedHeight = Math.round((props.img.width * y) / x);
</script>

<style lang="scss" scoped>
@use "../styles/variables" as v;

img {
  display: block;
}
</style>
