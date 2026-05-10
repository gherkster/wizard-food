<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { css, cx } from "styled-system/css";
import { token } from "styled-system/tokens";

import { useSearch, type FacetKey } from "~/composables/useSearch";
import type { SelectOption } from "~/types/form";
import { describeFilterCategories } from "~/utils/format";

const { activeFilters, clearFilters, options, updateFilters } = useSearch();

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

const filterDescription = computed(() => describeFilterCategories(activeFilters.value));

const allCuisinesLabel = "All cuisines";
const cuisineOptions = buildOptions("cuisine", allCuisinesLabel);

const allCoursesLabel = "All courses";
const courseOptions = buildOptions("course", allCoursesLabel);

const allDietsLabel = "All diets";
const dietOptions = buildOptions("diets", allDietsLabel);

const hasActiveFilters = computed(
  () => Object.values(activeFilters.value).filter(Boolean).length > 0,
);

const buttonCss = css({
  backgroundColor: token("colors.surface"),
  border: "2px solid",
  borderColor: token("colors.border"),
  borderTopLeftRadius: "md",
  borderTopRightRadius: "md",
  display: "flex",
  gap: "8px",
  justifyContent: "space-between",
  padding: "8px",
  width: "100%",

  md: {
    display: "none",
  },
});

const chevronCss = css({
  transition: "transform 0.2s ease",
});

const chevronOpenCss = css({
  transform: "rotate(180deg)",
});

const panelCss = css({
  display: "grid",
  gridTemplateRows: "0fr", // Closed by default on mobile
  opacity: 0,
  transitionProperty: "grid-template-rows, opacity, visibility",
  transitionDuration: "200ms",
  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  visibility: "hidden",
  width: "100%",

  md: {
    gridTemplateRows: "1fr",
    opacity: "1",
    visibility: "visible",
    transition: "none",
  },
});

const panelOpenCss = css({
  gridTemplateRows: "1fr",
  opacity: 1,
  visibility: "visible",
});

const innerHeightCss = css({
  minHeight: 0,
});

const contentCss = css({
  backgroundColor: token("colors.surface"),
  border: "2px solid",
  borderBottomLeftRadius: "md",
  borderBottomRightRadius: "md",
  borderColor: token("colors.border"),
  borderTopWidth: 0,
  padding: "xs",

  md: {
    borderTopWidth: "2px",
    borderRadius: "md",
  },
});

const selectContainerCss = css({
  display: "grid",
  gap: "xs",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  width: "100%",

  md: {
    display: "flex",
    flexDirection: "column",
    width: "240px",
  },
});

const actionsCss = css({
  display: "flex",
  height: token("fontSizes.sm"), // Reserve space for the reset button to avoid layout shift
  justifyContent: "flex-end",
  margin: "4px",
  marginRight: 0,

  md: {
    marginTop: "1.5em",
  },
});
</script>

<template>
  <Disclosure v-slot="{ open }" as="div">
    <DisclosureButton
      :class="buttonCss"
      :style="{
        borderBottomLeftRadius: open ? '0px' : token('radii.md'),
        borderBottomRightRadius: open ? '0px' : token('radii.md'),
      }"
    >
      <div :class="css({ alignItems: 'center', display: 'flex' })">
        <Icon name="mynaui:filter" :size="24" />
        <Text>{{ filterDescription ?? "Filter results" }}</Text>
      </div>

      <Icon name="mynaui:chevron-down" :class="cx(chevronCss, open && chevronOpenCss)" :size="24" />
    </DisclosureButton>

    <DisclosurePanel :class="cx(panelCss, open && panelOpenCss)" static>
      <div :class="innerHeightCss">
        <div :class="contentCss">
          <div :class="selectContainerCss">
            <Select
              :model-value="activeFilters.cuisine"
              :options="cuisineOptions"
              :placeholder="allCuisinesLabel"
              block
              label="Cuisine"
              @update:model-value="(value) => updateFilters({ cuisine: value })"
            />
            <Select
              :model-value="activeFilters.course"
              :options="courseOptions"
              :placeholder="allCoursesLabel"
              block
              label="Course"
              @update:model-value="(value) => updateFilters({ course: value })"
            />
            <Select
              :model-value="activeFilters.diets"
              :options="dietOptions"
              :placeholder="allDietsLabel"
              block
              label="Diet"
              @update:model-value="(value) => updateFilters({ diets: value })"
            />
          </div>

          <div :class="actionsCss">
            <Button v-if="hasActiveFilters" @click="clearFilters">
              <Text size="sm">Reset filters</Text>
            </Button>
          </div>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
