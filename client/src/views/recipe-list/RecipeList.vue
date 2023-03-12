<template>
  <div class="page content">
    <h1>Recipes</h1>
    <div class="content">
      <x-row class="recipe-list">
        <x-column v-for="recipe in recipes" col-6 col-md-4 col-lg-3 :key="recipe.slug">
          <recipe-preview
            :title="recipe.title"
            total-duration="4h 30m"
            image-src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            @click="goToRecipe(recipe.slug)"
          />
        </x-column>
      </x-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import apis from "@/constants/apis";
import { useAxios } from "@/composables";
import { XRow, XColumn } from "@/components";
import RecipePreview from "./RecipePreview.vue";
import { ref } from "vue";
import { Recipe } from "@/types/recipe";
import { useRouter } from "vue-router";

const axios = useAxios();
const router = useRouter();

const recipes = ref<Array<Recipe>>([]);

const { data } = await axios.get<Array<Recipe>>(apis.recipes);
recipes.value = data;

function goToRecipe(slug: string) {
  router.push("/recipes/" + slug);
}
</script>

<style lang="scss" scoped>
@use "../../styles/mixins" as m;
.recipe-list {
  display: flex;
  @include m.spacing("gy", "lg");
}
</style>
