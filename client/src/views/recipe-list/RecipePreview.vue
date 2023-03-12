<template>
  <div class="recipe-preview">
    <n-image height="140" object-fit="cover" width="999" :src="props.imageSrc" lazy preview-disabled @click="onClick" />
    <div class="recipe-preview__body" @click="onClick">
      <span>
        <b>{{ title }}</b>
      </span>
    </div>
    <n-divider />
    <div class="recipe-preview__footer">
      <div class="recipe-preview__duration text-muted">
        <font-awesome-icon icon="fa-regular fa-clock" />
        <span>{{ props.totalDuration }}</span>
      </div>
      <n-rate :value="props.rating" readonly size="small" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NImage, NDivider, NRate } from "naive-ui";

const props = defineProps<{
  title: string;
  imageSrc?: string;
  totalDuration: string;
  rating: number;
}>();

const emit = defineEmits<{
  (e: "input"): void;
}>();
function onClick() {
  emit("input");
}
</script>

<style lang="scss" scoped>
@use "../../styles/mixins" as m;
@use "../../styles/variables" as v;
.recipe-preview {
  display: flex;
  flex-direction: column;
  &__body {
    span {
      display: inline-flex;
      @include m.spacing("my", "xs");
      height: v.$line-height * 2;
      b {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: v.$line-height;
      }
    }
  }
  &__duration {
    display: flex;
    align-items: center;
    column-gap: 8px;
  }
  .n-divider {
    margin: 0;
  }
  &__footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-top: v.$paragraph-margin-top;
  }
}
</style>
