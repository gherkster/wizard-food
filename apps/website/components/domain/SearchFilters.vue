<script setup lang="ts">
import { css } from "styled-system/css";

import { useSearch, type FacetKey } from "~/composables/useSearch";
import type { SelectOption } from "~/types/form";

const { activeParams, clearFilters, options, updateSearch } = useSearch();

const buildOptions = (facet: FacetKey, allResultsLabel: string) =>
  computed<SelectOption[]>(() => {
    return [
      {
        label: allResultsLabel,
        value: "",
      },
      ...options.value[facet],
    ];
  });

const allCuisinesLabel = "All cuisines";
const cuisineOptions = buildOptions("cuisine", allCuisinesLabel);

const allCoursesLabel = "All courses";
const courseOptions = buildOptions("course", allCoursesLabel);

const allDietsLabel = "All diets";
const dietOptions = buildOptions("diets", allDietsLabel);

const hasActiveFilters = computed(
  () => Object.values(activeParams.value).filter(Boolean).length > 0,
);
</script>

<template>
  <div :class="css({ alignItems: 'end', display: 'flex', flexWrap: 'wrap', gap: 'xs' })">
    <Select
      :model-value="activeParams.c"
      :options="cuisineOptions"
      :placeholder="allCuisinesLabel"
      label="Cuisine"
      @update:model-value="(value) => updateSearch({ c: value })"
    />
    <Select
      :model-value="activeParams.m"
      :options="courseOptions"
      :placeholder="allCoursesLabel"
      label="Course"
      @update:model-value="(value) => updateSearch({ m: value })"
    />
    <Select
      :model-value="activeParams.d"
      :options="dietOptions"
      :placeholder="allDietsLabel"
      label="Diet"
      @update:model-value="(value) => updateSearch({ d: value })"
    />
    <Chip v-if="activeParams.q" :label="activeParams.q" @delete="() => updateSearch({ q: '' })" />

    <Button v-if="hasActiveFilters" :class="css({ marginBottom: '0.5em' })" @click="clearFilters">
      <Text size="sm">Clear all</Text>
    </Button>
  </div>
</template>
