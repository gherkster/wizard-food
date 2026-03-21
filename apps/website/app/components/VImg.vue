<template>
  <img
    ref="imgRef"
    :src="src"
    :alt="img.title"
    :width="img.width"
    :height="adjustedHeight"
    :loading="lazy ? 'lazy' : undefined"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  img: Image;
  purpose: ImagePurpose;
  aspectRatio: AspectRatio;
  thumbnail?: boolean;
  lazy?: boolean;
}>();

const imgRef = useTemplateRef("imgRef");

defineExpose({
  img: imgRef,
});

const image = useImage();

const src =
  props.thumbnail && props.img.metadata?.base64Url
    ? props.img.metadata.base64Url
    : image.buildRelativeUrl({
        id: props.img.id,
        fileName: props.img.fileName,
        modifyDate: props.img.modifyDate,
        purpose: props.purpose,
        aspectRatio: props.aspectRatio,
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
