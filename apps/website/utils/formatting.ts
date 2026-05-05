import Fraction from "fraction.js";

/**
 * Formats an ingredient into a single line label
 * @param ingredient The amount, name, units and note of an ingredient.
 */
export const formatIngredient = (ingredient: {
  amount?: Fraction | number;
  name: string;
  unit?: string;
  note?: string;
}) => {
  const amountFraction =
    typeof ingredient.amount === "number" ? new Fraction(ingredient.amount) : ingredient.amount;
  const formattedAmount = amountFraction ? formatIngredientAmount(amountFraction) : "";

  const unit = ingredient.unit?.toString() ?? "";
  const note = ingredient.note ?? "";

  const value = `${formattedAmount} ${unit} ${ingredient.name} ${note}`;
  return value.trim();
};

/**
 * Format the recipe ingredient in a consistent way
 * @param amount The ingredient amount
 * @returns The ingredient amount, rounded to avoid excessively accurate fractions
 */
export const formatIngredientAmount = (amount: Fraction) => {
  const decimalAmount = amount.valueOf();

  // Round numbers relative to their size
  if (decimalAmount > 1000) {
    amount = amount.div(25).ceil().mul(25);
  } else if (decimalAmount > 100) {
    amount = amount.div(10).ceil().mul(10);
  } else if (decimalAmount > 50) {
    amount = amount.div(5).ceil().mul(5);
  } else if (decimalAmount > 10) {
    amount = amount.round();
  } else {
    const roundedToOneEighth = amount.roundTo("1/8");
    const roundedToOneThird = amount.roundTo("1/3");

    /*
      We want the maximum accuracy to be 1/8 to avoid excessively precise fractions,
      however 1/3 or 2/3 is often a better approximation for things like going from 6 to 4 servings
    */
    amount =
      Math.abs(roundedToOneEighth.valueOf() - decimalAmount) <
      Math.abs(roundedToOneThird.valueOf() - decimalAmount)
        ? roundedToOneEighth
        : roundedToOneThird;
  }

  return amount.toFraction(true).trim();
};
