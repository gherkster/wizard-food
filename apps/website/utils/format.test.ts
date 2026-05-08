import { expect, test } from "vitest";

import type { SearchParams } from "../composables/useSearch";
import { formatSearchSummary } from "./format";

const emptySearch: SearchParams = { c: "", d: "", m: "", q: "" };

test("No filters to display all recipes message", () => {
  expect(formatSearchSummary(emptySearch, { hasResults: true })).toBe("All recipes");
});

test("Only cuisine to display cuisine recipes message", () => {
  const search = { ...emptySearch, c: "German" };

  expect(formatSearchSummary(search, { hasResults: true })).toBe("German recipes");
});

test("Cuisine and course to display combined message", () => {
  const search = { ...emptySearch, c: "German", m: "Mains" };

  expect(formatSearchSummary(search, { hasResults: true })).toBe("German Mains");
});

test("Cuisine, course and diet to display combined message", () => {
  const search = { ...emptySearch, c: "Indian", m: "Snacks", d: "Vegan" };

  expect(formatSearchSummary(search, { hasResults: true })).toBe("Vegan Indian Snacks");
});

test("Search text and filters with results to display combined message", () => {
  const search = { c: "Indian", m: "Mains", d: "Vegetarian", q: "curry" };

  expect(formatSearchSummary(search, { hasResults: true })).toBe(
    'Results for "curry" in Vegetarian Indian Mains',
  );
});

test("Search text and filters with no results to display no results message", () => {
  const search = { c: "Indian", m: "Mains", d: "Vegetarian", q: "curry" };

  expect(formatSearchSummary(search, { hasResults: false })).toBe(
    'No results for "curry" in Vegetarian Indian Mains',
  );
});
