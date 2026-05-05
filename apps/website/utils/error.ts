/**
 * Throws an error if the given value is undefined or null.
 * @param value The value to be checked for a non-nil value.
 * @param message The message of the thrown error.
 */
export function throwIfNil<T>(value: T | undefined | null, message: string): asserts value is T {
  if (value === undefined || value === null) {
    throw new Error(message);
  }
}
