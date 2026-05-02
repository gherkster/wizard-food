import Fraction from "fraction.js";

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

export const formatIngredientAmount = (amount: Fraction) => {
  const decimalAmount = amount.valueOf();

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

    amount =
      Math.abs(roundedToOneEighth.valueOf() - decimalAmount) <
      Math.abs(roundedToOneThird.valueOf() - decimalAmount)
        ? roundedToOneEighth
        : roundedToOneThird;
  }

  return amount.toFraction(true).trim();
};
