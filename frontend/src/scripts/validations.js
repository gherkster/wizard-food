export function isRequired(value, message) {
  return !!value || message;
}

export function isInteger(value, message) {
  return /^\d+$/.test(value) || message;
}

export function isDecimal(value, message) {
  return /^\d+(\.\d{1,2})?$/.test(value) || message;
}

export function isBetween(value, minValue, maxValue, message) {
  return (minValue <= value && value <= maxValue) || message;
}

export function noDuplicates(array, message) {
  return new Set(array).size === array.length || message;
}

export function isSlug(slug, message) {
  return /^[a-zA-Z0-9](-?[a-zA-Z0-9])*$/.test(slug) || message;
}
