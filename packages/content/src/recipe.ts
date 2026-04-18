export type SingularPluralPair = {
  singular: string;
  plural: string;
};

export type InlineIngredient = {
  amount?: number;
  unit?: SingularPluralPair;
  name: SingularPluralPair;
};

export interface InlineIngredientHTMLElementDataset extends DOMStringMap {
  ingredient: string;
}
