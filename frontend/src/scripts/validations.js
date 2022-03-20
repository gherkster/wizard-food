export function isRequired(value, message) {
  return !!value || message;
}

export function noDuplicates(array, message) {
  console.log(array, " has duplicates: ", new Set(array).size === array.length);
  return new Set(array).size === array.length || message;
}
