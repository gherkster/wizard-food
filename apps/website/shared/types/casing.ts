type CamelToKebabCase<S extends string> = S extends `${infer C}${infer R}`
  ? R extends Uncapitalize<R>
    ? `${Lowercase<C>}${CamelToKebabCase<R>}`
    : `${Lowercase<C>}-${CamelToKebabCase<R>}`
  : Lowercase<S>;

// Transforms an object with camelCase keys to data-kebab-case keys
export type KebabCaseDataAttributes<T extends object> = {
  [K in keyof T as K extends string ? `data-${CamelToKebabCase<K>}` : never]: T[K] extends
    | infer U
    | undefined
    ? U
    : T[K];
};
