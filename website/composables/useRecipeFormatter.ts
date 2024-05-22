import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Fraction from "fraction.js";

function formatIngredient(ingredient: { amount?: number; name: string; unit?: string; note?: string }) {
  const amountFraction = ingredient.amount ? formatIngredientAmount(ingredient.amount) : "";
  const unit = ingredient.unit?.toString() ?? "";
  const note = ingredient.note ?? "";

  const value = `${amountFraction} ${unit} ${ingredient.name} ${note}`;
  return value.trim();
}

/**
 * Format the recipe ingredient in a consistent way
 * @param amount The ingredient amount
 * @returns The ingredient amount, rounded to avoid excessively accurate fractions
 */
function formatIngredientAmount(amount: number) {
  let amountFraction = new Fraction(amount);

  // Round numbers relative to their size
  if (amount > 1000) {
    amountFraction = amountFraction.div(25).ceil().mul(25);
  } else if (amount > 100) {
    amountFraction = amountFraction.div(10).ceil().mul(10);
  } else if (amount > 50) {
    amountFraction = amountFraction.div(5).ceil().mul(5);
  } else if (amount > 10) {
    amountFraction = amountFraction.round();
  } else {
    // @ts-expect-error fraction.js@4.3.7 does not include type for roundTo
    const roundedToOneEighth = amountFraction.roundTo("1/8") as Fraction;
    // @ts-expect-error fraction.js@4.3.7 does not include type for roundTo
    const roundedToOneThird = amountFraction.roundTo("1/3") as Fraction;

    /*
      We want the maximum accuracy to be 1/8 to avoid excessively precise fractions,
      however 1/3 or 2/3 is often a better approximation for things like going from 6 to 4 servings
    */
    amountFraction =
      Math.abs(roundedToOneEighth.valueOf() - amount) < Math.abs(roundedToOneThird.valueOf() - amount)
        ? roundedToOneEighth
        : roundedToOneThird;
  }

  return amountFraction.toFraction(true).trim();
}

function formatMinutesAsDuration(seconds: number) {
  dayjs.extend(duration);
  const totalDuration = dayjs.duration(seconds, "seconds");

  const formatStrings = [];
  if (totalDuration.asDays() >= 1) {
    formatStrings.push("D[d]");
  }
  if (totalDuration.asHours() >= 1) {
    formatStrings.push("H[h]");
  }
  if (totalDuration.asMinutes() >= 1) {
    formatStrings.push("m[m]");
  }
  return totalDuration.format(formatStrings.join(" "));
}

export function useRecipeFormatter() {
  return {
    formatIngredient,
    formatIngredientAmount,
    formatMinutesAsDuration,
  };
}
