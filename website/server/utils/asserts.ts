/**
 * Asserts that the result item from Directus has been hydrated with its relational data. Throws if it is a non-object ID.
 * @param item The relational data or ID to be tested for hydration.
 */
export function assertIsHydrated<T>(item: T | number | string): asserts item is T {
  if (typeof item !== "object") {
    throw new Error(
      `Item ${item} is an ID and has not been hydrated by including it in the related entities request query.`,
    );
  }
}
