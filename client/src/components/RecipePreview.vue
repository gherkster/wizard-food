<template>
  <div class="recipe-preview">
    <n-image :src="imageSrc" lazy preview-disabled @click="onClick" />
    <div class="recipe-preview__body" @click="onClick">
      <b>{{ title }}</b>
      <p v-if="description">{{ description }}</p>
    </div>
    <n-divider />
    <div class="recipe-preview__footer">
      <div class="recipe-preview__duration">
        <x-icon fa-icon="fa-clock" />
        <span>{{ totalDuration }}</span>
      </div>
      <n-rate :value="rating" size="small" />
    </div>
  </div>
</template>

<script>
import { NImage, NDivider, NRate } from "naive-ui";
import { XIcon } from "@/components";

export default {
  name: "RecipePreview",
  components: {
    XIcon,
    NImage,
    NDivider,
    NRate,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    imageSrc: {
      type: String,
      required: false,
      default: "",
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    totalDuration: {
      type: String,
      required: false,
      default: "",
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
@use "../styles/mixins" as m;
@use "../styles/variables" as v;
.recipe-preview {
  display: flex;
  flex-direction: column;
  &__body {
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: v.$line-height;
      max-height: v.$line-height * 2;
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
