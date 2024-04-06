import Fraction from "fraction.js";

export function useIngredientMultiplier() {
  function multiplyToFraction(amount: number, multiplier: number, originalNumberOfServings: number) {
    return new Fraction(amount).mul(multiplier).div(originalNumberOfServings).toFraction(true);
  }
  return {
    multiplyToFraction,
  };
}
