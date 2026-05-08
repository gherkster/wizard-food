/**
 * Gets the string value of a query parameter, or undefined if is missing or the wrong type.
 *
 * This function must be called from a location where useRoute() is available.
 * @param name The name of the query parameter to retrieve.
 */
export const getQueryParam = (name: string) => {
  const route = useRoute();

  const value = route.query[name];

  if (value === undefined || typeof value !== "string") {
    return undefined;
  }

  return value;
};
