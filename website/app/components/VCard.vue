<template>
  <nuxt-link :to="link" class="concealed">
    <div class="card" :class="variant">
      <blurrable-image
        :img="image"
        :lazy="lazyLoadImage"
        :purpose="variant === 'promo' ? 'cover' : 'preview'"
        aspect-ratio="square"
      />
      <div class="card__content">
        <p class="title">{{ title }}</p>
        <p v-if="description">{{ description }}</p>
        <div class="card__stats">
          <span v-if="tag" class="card__label no-underline">
            <small
              ><span>{{ tag }}</span>
            </small>
          </span>
          <span v-if="duration" class="card__label card__duration no-underline">
            <icon name="mynaui:clock-four" :size="18" />
            <small
              ><span>{{ duration }}</span></small
            >
          </span>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description?: string;
    link: string;
    image: Image;
    lazyLoadImage?: boolean;
    variant?: "preview" | "promo";
    tag?: string;
    duration?: string;
  }>(),
  {
    description: "",
    variant: "preview",
    tag: "",
    duration: "",
    lazyLoadImage: false,
  },
);
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;
.card {
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
  }
  &__duration {
    display: inline-flex;
    align-items: center;
    .icon {
      margin-right: 4px;
    }
  }
  small {
    text-wrap: nowrap;
  }
  @media (hover: hover) {
    &:hover {
      top: -2px;
    }
  }
}
.card.promo {
  display: flex;
  background-color: var(--theme-body-accent-color);
  border-radius: v.$border-radius-sm;
  @include m.breakpoint("sm", "max") {
    flex-direction: column;
  }
  .card__content {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    @include m.spacing("p", "sm");
  }
}
small {
  span {
    // Wrap contents of small with inline-block span to avoid
    // a tag underline style propagating down to the tag and duration
    display: inline-block;
  }
}
</style>

<style lang="scss">
@use "@/styles/mixins" as m;
.card.preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  .card__content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
  }
}
.card.promo {
  @include m.breakpoint("sm", "max") {
    .image-container {
      border-bottom-left-radius: unset;
      border-bottom-right-radius: unset;
    }
  }
  @include m.breakpoint("sm") {
    .image-container {
      border-top-right-radius: unset;
      border-bottom-right-radius: unset;
    }
  }
}
</style>
