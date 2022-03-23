export function isRequired(value, message) {
  return !!value || message;
}

export function noDuplicates(array, message) {
  return new Set(array).size === array.length || message;
}
