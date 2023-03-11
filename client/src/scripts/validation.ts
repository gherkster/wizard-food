import { ValidationRule } from "@vuelidate/core";

export const slugPattern = /^[a-zA-Z\d](-?[a-zA-Z\d])*$/;

const fractionPattern = /(?:[1-9][0-9]*|0)\/[1-9][0-9]*$/;
export const fraction: ValidationRule = (value: string) => fractionPattern.test(value);
