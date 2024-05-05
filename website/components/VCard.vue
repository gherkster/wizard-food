<template>
  <nuxt-link :to="link">
    <div class="recipe-preview" :class="variant">
      <blurrable-image :img="image" purpose="preview" />
      <div class="recipe-preview__content">
        <p class="title">{{ title }}</p>
        <p v-if="description">{{ description }}</p>
        <div class="recipe-preview__stats text-grey">
          <span v-if="tag" class="recipe-preview__label">
            <small>
              {{ tag }}
            </small>
          </span>
          <span v-if="duration" class="recipe-preview__label recipe-preview__duration">
            <icon name="mdi:clock-outline" size="18px" />
            <small>{{ duration }}</small>
          </span>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
import type { Image } from "~/types/recipe";

withDefaults(
  defineProps<{
    title: string;
    description?: string;
    link: string;
    image: Image;
    variant?: "preview" | "promo";
    tag?: string;
    duration?: string;
  }>(),
  {
    description: "",
    variant: "preview",
    tag: "",
    duration: "",
  },
);
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;
.recipe-preview {
  position: relative;
  &__content {
    @include m.spacing("py", "xs");
    .title {
      font-weight: v.$font-weight-bold;
    }
    > p {
      margin-top: 0;
    }
  }
  &__stats {
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
  }
  &__label {
    display: inline-flex;
    align-items: center;
    font-weight: v.$font-weight-bold;
  }
  &__duration {
    display: inline-flex;
    align-items: center;
    text-transform: uppercase;
    > svg {
      margin-right: 4px;
    }
  }
  small {
    text-wrap: nowrap;
  }
  &:hover {
    top: -2px;
  }
}
.recipe-preview.promo {
  display: flex;
  background-color: v.$colour-bg-highlight;
  border-radius: v.$border-radius-sm;
  @include m.breakpoint("sm", "max") {
    flex-direction: column;
  }
  .recipe-preview__content {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    @include m.spacing("p", "sm");
  }
}
</style>

<style lang="scss">
@use "@/styles/mixins" as m;
@include m.breakpoint("sm", "max") {
  .image-container {
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
  }
}
@include m.breakpoint("sm") {
  .image-container {
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
  }
}
</style>
