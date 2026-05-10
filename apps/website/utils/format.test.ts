import { describe, expect, test } from "vitest";

import type { FilterParams } from "../composables/useSearch";
import { describeFilterCategories, describeSearchResults } from "./format";

const emptyFilters: FilterParams = {
  course: undefined,
  cuisine: undefined,
  diets: undefined,
};

describe("Describe filter categories", () => {
  test("No filters to display all recipes message", () => {
    expect(describeFilterCategories(emptyFilters)).toBe(undefined);
  });

  test("Only cuisine to display cuisine recipes message", () => {
    const search: FilterParams = { ...emptyFilters, cuisine: "German" };

    expect(describeFilterCategories(search)).toBe("German recipes");
  });

  test("Cuisine and course to display combined message", () => {
    const search: FilterParams = { ...emptyFilters, cuisine: "German", course: "Mains" };

    expect(describeFilterCategories(search)).toBe("German Mains");
  });

  test("Cuisine, course and diet to display combined message", () => {
    const search: FilterParams = {
      cuisine: "Indian",
      course: "Snacks",
      diets: "Vegan",
    };

    expect(describeFilterCategories(search)).toBe("Vegan Indian Snacks");
  });
});

describe("Describe search results", () => {
  test("Search text and filters with single result to display single result message", () => {
    const filters: FilterParams = {
      cuisine: "Indian",
      course: "Mains",
      diets: "Vegetarian",
    };

    expect(describeSearchResults("curry", filters, { resultCount: 1 })).toBe(
      '1 result for "curry" in Vegetarian Indian Mains',
    );
  });

  test("Search text and filters with multiple results to display multiple results message", () => {
    const filters: FilterParams = {
      cuisine: "Indian",
      course: "Mains",
      diets: "Vegetarian",
    };

    expect(describeSearchResults("curry", filters, { resultCount: 2 })).toBe(
      '2 results for "curry" in Vegetarian Indian Mains',
    );
  });

  test("Search text and filters with no results to display no results message", () => {
    const filters: FilterParams = {
      cuisine: "Indian",
      course: "Mains",
      diets: "Vegetarian",
    };

    expect(describeSearchResults("curry", filters, { resultCount: 0 })).toBe(
      'No results for "curry" in Vegetarian Indian Mains',
    );
  });
});
