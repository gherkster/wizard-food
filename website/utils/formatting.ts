import dayjs from "dayjs";
import duration, { type Duration } from "dayjs/plugin/duration";
import type Fraction from "fraction.js";
import type { Recipe } from "~/types/recipe";

export const formatIngredient = (ingredient: {
  amount?: Fraction;
  name: string;
  unit?: string;
  note?: string;
}) => {
  const amountFraction = ingredient.amount ? formatIngredientAmount(ingredient.amount) : "";
  const unit = ingredient.unit?.toString() ?? "";
  const note = ingredient.note ?? "";

  const value = `${amountFraction} ${unit} ${ingredient.name} ${note}`;
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
    // @ts-expect-error fraction.js@4.3.7 does not include type for roundTo
    const roundedToOneEighth = amount.roundTo("1/8") as Fraction;
    // @ts-expect-error fraction.js@4.3.7 does not include type for roundTo
    const roundedToOneThird = amount.roundTo("1/3") as Fraction;

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

export const secondsToDuration = (seconds: number): Duration => {
  dayjs.extend(duration);

  return dayjs.duration(seconds, "seconds");
};

export const formatDuration = (duration: Duration): string | undefined => {
  if (duration.asSeconds() === 0) {
    return undefined;
  }

  const formatStrings: string[] = [];
  if (duration.days() >= 1) {
    formatStrings.push("D[d]");
  }
  if (duration.hours() >= 1) {
    formatStrings.push("H[h]");
  }
  if (duration.minutes() >= 1) {
    formatStrings.push("m[m]");
  }

  return duration.format(formatStrings.join(" "));
};

type RecipeDuration = {
  preparationDuration?: number;
  cookingDuration?: number;
  customDuration?: number;
};

export const recipeTotalDuration = (recipe: RecipeDuration) => {
  const sumDuration =
    (recipe.preparationDuration ?? 0) +
    (recipe.cookingDuration ?? 0) +
    (recipe.customDuration ?? 0);

  return secondsToDuration(sumDuration);
};

export const formatRecipeDurations = (recipe: Recipe) => {
  return {
    preparation: recipe.preparationDuration
      ? formatDuration(secondsToDuration(recipe.preparationDuration))
      : undefined,
    cooking: recipe.cookingDuration
      ? formatDuration(secondsToDuration(recipe.cookingDuration))
      : undefined,
    custom:
      recipe.customDuration && recipe.customDurationName
        ? formatDuration(secondsToDuration(recipe.customDuration))
        : undefined,
    total: formatDuration(recipeTotalDuration(recipe)),
  };
};
