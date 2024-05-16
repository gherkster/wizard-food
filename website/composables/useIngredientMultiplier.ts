import Fraction from "fraction.js";

function multiplyToFraction(amount: number, multiplier: number, originalNumberOfServings: number) {
  return new Fraction(amount).mul(multiplier).div(originalNumberOfServings).toFraction(true);
}

function multiplyToNumber(amount: number, multiplier: number, originalNumberOfServings: number) {
  return new Fraction(amount).mul(multiplier).div(originalNumberOfServings).valueOf();
}

export function useIngredientMultiplier() {
  return {
    multiplyToFraction,
    multiplyToNumber,
  };
}
