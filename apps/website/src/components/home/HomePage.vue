<template>
  <div class="home">
    <section v-if="featuredRecipes.latestRecipes.length > 0">
      <div class="section-header">
        <h2>Latest Recipes</h2>
        <a href="/recipes" class="section-header__link concealed" aria-label="See all recipes">
          <span>See more</span>
          <span class="section-header__icon" aria-hidden="true">›</span>
        </a>
      </div>
      <div class="recipe-list promo">
        <v-card
          v-for="(recipe, index) in featuredRecipes.latestRecipes"
          :key="recipe.slug"
          :title="recipe.title"
          :description="index === 0 ? recipe.descriptionSnippet : undefined"
          :link="`/recipes/${recipe.slug}`"
          :image="recipe.coverImage"
          :tag="recipe.featuredTag"
          :duration="recipe.totalDurationLabel"
          :variant="index === 0 ? 'promo' : 'preview'"
        />
      </div>
    </section>
    <section v-if="featuredRecipes.favouriteRecipes.length > 0">
      <div class="section-header">
        <h2>Personal Favourites</h2>
      </div>
      <div class="recipe-list standard">
        <v-card
          v-for="recipe in featuredRecipes.favouriteRecipes"
          :key="recipe.slug"
          :title="recipe.title"
          :image="recipe.coverImage"
          :link="`/recipes/${recipe.slug}`"
          :tag="recipe.featuredTag"
          :duration="recipe.totalDurationLabel"
          lazy-load-image
        />
      </div>
    </section>
    <section v-if="featuredRecipes.quickRecipes.length > 0">
      <div class="section-header">
        <h2>Quick Eats</h2>
      </div>
      <div class="recipe-list standard">
        <v-card
          v-for="recipe in featuredRecipes.quickRecipes"
          :key="recipe.slug"
          :title="recipe.title"
          :image="recipe.coverImage"
          :link="`/recipes/${recipe.slug}`"
          :tag="recipe.featuredTag"
          :duration="recipe.totalDurationLabel"
          lazy-load-image
        />
      </div>
    </section>
    <section v-if="featuredRecipes.worldCuisineRecipes.length > 0">
      <div class="section-header">
        <h2>World Cuisines</h2>
      </div>
      <div class="recipe-list standard">
        <VCard
          v-for="recipe in featuredRecipes.worldCuisineRecipes"
          :key="recipe.slug"
          :title="recipe.title"
          :image="recipe.coverImage"
          :link="`/recipes/${recipe.slug}`"
          :tag="recipe.featuredTag"
          :duration="recipe.totalDurationLabel"
          lazy-load-image
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { FeaturedRecipes } from "@wizard/content/store";

import VCard from "@/components/VCard.vue";

const props = defineProps<{
  featuredRecipes: FeaturedRecipes;
}>();
</script>

<style lang="scss" scoped>
@use "../../styles/mixins" as m;
@use "../../styles/variables" as v;

.home {
  display: flex;
  flex-direction: column;
  @include m.spacing("gy", "lg");

  .recipe-list {
    display: grid;
    @include m.spacing("g", "sm");
  }

  .recipe-list.standard {
    @include m.breakpoint("xs") {
      grid-template-columns: repeat(2, 1fr);
    }
    @include m.breakpoint("sm") {
      grid-template-columns: repeat(3, 1fr);
    }
    @include m.breakpoint("md") {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .recipe-list.promo {
    @include m.breakpoint("xs") {
      grid-template-columns: repeat(2, 1fr);
      > *:first-child {
        grid-column: 1 / 3;
      }
    }
    @include m.breakpoint("sm") {
      grid-template-columns: repeat(2, 1fr);
      > *:first-child {
        grid-column: 1/3;
      }
    }
    @include m.breakpoint("lg") {
      grid-template-columns: repeat(5, 1fr);
      > *:first-child {
        grid-column: 1/4;
      }
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // Move header margin to the container to vertically align both sides
    margin-bottom: v.$header-margin-bottom;
    h2 {
      margin-bottom: 0;
    }
    span {
      vertical-align: middle;
      @include m.breakpoint("sm", "max") {
        display: none;
      }
    }
    &__link {
      display: inline-flex;
      align-items: center;
      span {
        @include m.spacing("pr", "xxs");
      }
    }
    &__icon {
      font-size: 24px;
      line-height: 1;
    }
  }
}
</style>

<style lang="scss">
.card {
  .title {
    font-size: 1.075rem; // Boost font size on home page
  }
}
</style>
