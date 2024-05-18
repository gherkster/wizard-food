import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Fraction from "fraction.js";

function formatIngredient(ingredient: { amount?: number | string; name: string; unit?: string; note?: string }) {
  const amountFraction = ingredient.amount ? new Fraction(ingredient.amount).toFraction(true) : "";
  const unit = ingredient.unit?.toString() ?? "";
  const note = ingredient.note ?? "";

  const value = `${amountFraction} ${unit} ${ingredient.name} ${note}`;
  return value.trim();
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
    formatMinutesAsDuration,
  };
}
