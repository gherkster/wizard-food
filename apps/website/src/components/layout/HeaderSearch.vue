<template>
  <div class="nav-header-search">
    <v-mascot
      :excited="isAnimated"
      :size="54"
      class="nav-header-search__mascot"
      @click="animateMascot"
    />
    <v-search
      :value="query"
      class="nav-header-search__input"
      @input="onInput"
      @search="onInput"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import VSearch from "@/components/VSearch.vue";
import VMascot from "@/components/VMascot.vue";
import { debounce } from "@/utils/debounce";
import { useSearch } from "@/composables/useSearch";

const searchClient = useSearch();
searchClient.ensureIndex();

const query = ref("");

const onInput = (value: string) => {
  search(value);
  animateMascot();
};

const searchDebounceMs = 150;

const search = debounce(async (value: string) => {
  query.value = value;
  const trimmedQuery = query.value.trim();

  if (trimmedQuery.length === 0) {
    window.location.assign("/recipes");
    return;
  }

  window.location.assign(`/recipes?search=${encodeURIComponent(trimmedQuery)}`);
  return;
}, searchDebounceMs);

const isAnimated = ref(false);

const animateMascot = () => {
  isAnimated.value = true;
  finishAnimating();
};

const animationDebounceMs = 1000;

const finishAnimating = debounce(() => {
  isAnimated.value = false;
}, animationDebounceMs);

onMounted(() => {
  const initialQuery = new URLSearchParams(window.location.search).get("search");
  query.value = initialQuery ?? "";
});
</script>
