<template>
  <div class="home">
    <section v-if="latestRecipes.length > 0">
      <div class="section-header">
        <h2>Latest Recipes</h2>
        <nuxt-link
          to="/recipes"
          class="section-header__link concealed"
          aria-label="See all recipes"
        >
          <span>See more</span>
          <v-icon :icon="circleChevronRight" :size="24" />
        </nuxt-link>
      </div>
      <div class="recipe-list promo">
        <v-card
          v-for="(recipe, index) in latestRecipes"
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
    <section v-if="favouriteRecipes.length > 0">
      <div class="section-header">
        <h2>Personal Favourites</h2>
        <!-- <nuxt-link class="section-header__link">
          <span>See more</span>
          <icon :name="headerIcon.name" :size="headerIcon.size" />
        </nuxt-link> -->
      </div>
      <div class="recipe-list standard">
        <v-card
          v-for="recipe in favouriteRecipes"
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
    <section v-if="quickRecipes.length > 0">
      <div class="section-header">
        <h2>Quick Eats</h2>
        <!-- <nuxt-link class="section-header__link">
          <span>See more</span>
          <icon :name="headerIcon.name" :size="headerIcon.size" />
        </nuxt-link> -->
      </div>
      <div class="recipe-list standard">
        <v-card
          v-for="recipe in quickRecipes"
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
    <section v-if="worldCuisineRecipes.length > 0">
      <div class="section-header">
        <h2>World Cuisines</h2>
        <!-- <nuxt-link class="section-header__link">
          <span>See more</span>
          <icon :name="headerIcon.name" :size="headerIcon.size" />
        </nuxt-link> -->
      </div>
      <div class="recipe-list standard">
        <v-card
          v-for="recipe in worldCuisineRecipes"
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
import circleChevronRight from "~icons/gravity-ui/circle-chevron-right";

const recipesResponse = await useAsyncData(async () => {
  const { data: response } = await useFetch("/api/featured-recipes");
  return response.value;
});

if (recipesResponse.error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: recipesResponse.error.value?.message,
  });
}

if (!recipesResponse.data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found!",
  });
}

const latestRecipes = ref(recipesResponse.data.value.latestRecipes);
const favouriteRecipes = ref(recipesResponse.data.value.favouriteRecipes);
const quickRecipes = ref(recipesResponse.data.value.quickRecipes);
const worldCuisineRecipes = ref(recipesResponse.data.value.worldCuisineRecipes);

const contentResponse = await useAsyncData(async () => {
  const { data: response } = await useFetch("/api/content/home");
  return response.value;
});

if (contentResponse.error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: recipesResponse.error.value,
  });
}

if (!contentResponse.data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Content not found!",
  });
}

const content = contentResponse.data.value;

useServerSeoMeta({
  title: content.title,
  ogTitle: content.title,
  description: content.description,
  ogDescription: content.openGraphDescription,
});
useHead({
  title: content.title,
});
</script>

<style lang="scss" scoped>
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;

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
