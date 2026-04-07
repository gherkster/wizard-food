export const throwExpression = (errorMessage: string): never => {
  throw new Error(errorMessage);
};

export function assertIsHydrated<T>(item: T | number | string, name: string): asserts item is T {
  if (item === undefined || item === null) {
    throw new Error(`Item ${name} is undefined or null.`);
  }

  if (typeof item !== "object") {
    throw new Error(
      `Item ${name} with value '${item.toString()}' is an ID and has not been hydrated by including it in the related entities request query.`,
    );
  }
}
