<template>
  <div>
    <span>{{ props.title }}</span>
  </div>
</template>

<script setup lang="ts">
import { Image } from "~/types/recipe";

const props = defineProps<{
  title: string;
  coverImage?: Image;
}>();
</script>

<style scoped lang="scss">

</style>