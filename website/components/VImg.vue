<template>
  <img :src="src.toString()" :alt="img.title" :width="props.img.width" :height="props.img.height" />
</template>

<script setup lang="ts">
import { Image } from "~/types/recipe";

const props = defineProps<{
  img: Image;
  thumbnail?: boolean;
}>();

const src = ref(`/images/${props.img.id}?modifyDate=${props.img.modifyDate}`);

if (props.thumbnail) {
  src.value += "&thumbnail=true";
}
</script>
