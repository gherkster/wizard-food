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
import type { Image, ImagePurpose, ImageShape } from "@wizard/content";

import { getAspectRatio, getVariant } from "~/composables/useImage";

const props = defineProps<{
  img: Image;
  purpose: ImagePurpose;
  shape: ImageShape;
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

const variant = getVariant(props.img, props.purpose, props.shape);

const src =
  props.thumbnail && props.img.metadata?.base64Url ? props.img.metadata.base64Url : variant.src;

const alt = props.alt ?? (props.thumbnail ? "" : props.img.title);

/*
Set the height based on the final image aspect ratio to avoid CLS issues when loading
e.g. a 3:4 aspect ratio image should have a height which is 4/3 x width
*/
const { x, y } = getAspectRatio(props.shape);
const adjustedHeight = Math.round((props.img.width * y) / x);
</script>

<style lang="scss" scoped>
@use "@/styles/variables" as v;

img {
  display: block;
}
</style>
