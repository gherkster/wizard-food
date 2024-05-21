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

const smallestFraction = new Fraction("1/8");

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
  }
  if (amount > 100) {
    amountFraction = amountFraction.div(10).ceil().mul(10);
  }
  if (amount > 50) {
    amountFraction = amountFraction.div(5).ceil().mul(5);
  }
  if (amount > 10) {
    amountFraction = amountFraction.round();
  }

  // @ts-expect-error fraction.js@4.3.7 does not include type for roundTo
  return amountFraction.roundTo(smallestFraction).toFraction(true).trim();
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
