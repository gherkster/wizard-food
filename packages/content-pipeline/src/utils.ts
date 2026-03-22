export const throwExpression = (errorMessage: string): never => {
  throw new Error(errorMessage);
};

export function assertIsHydrated<T>(item: T | number | string): asserts item is T {
  if (typeof item !== "object") {
    throw new Error(
      `Item ${item} is an ID and has not been hydrated by including it in the related entities request query.`,
    );
  }
}
