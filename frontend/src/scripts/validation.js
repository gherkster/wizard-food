export function isRequired(value, message) {
  return !!value || message;
}

export function isDecimal(value, message) {
  return !value || /^\d+(\.\d{1,2})?$/.test(value) || message;
}

export function isSlug(slug, message) {
  return /^[a-zA-Z0-9](-?[a-zA-Z0-9])*$/.test(slug) || message;
}

export const slugPattern = /^[a-zA-Z\d](-?[a-zA-Z\d])*$/;
