const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

const fractionFromDecimal = (value: number) => {
  const candidates = [2, 3, 4, 8];
  let bestNumerator = 0;
  let bestDenominator = 1;
  let bestDiff = Number.POSITIVE_INFINITY;

  candidates.forEach((denominator) => {
    const numerator = Math.round(value * denominator);
    const diff = Math.abs(value - numerator / denominator);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestNumerator = numerator;
      bestDenominator = denominator;
    }
  });

  if (bestNumerator === 0) {
    return "";
  }

  const divisor = gcd(bestNumerator, bestDenominator);
  return `${bestNumerator / divisor}/${bestDenominator / divisor}`;
};

export const formatIngredientAmount = (amount: number) => {
  const rounded = Math.round(amount * 1000) / 1000;
  const whole = Math.trunc(rounded);
  const decimal = rounded - whole;

  if (decimal === 0) {
    return `${whole}`;
  }

  const fraction = fractionFromDecimal(decimal);
  if (!fraction) {
    return rounded.toFixed(2).replace(/\.00$/, "");
  }

  if (whole === 0) {
    return fraction;
  }

  return `${whole} ${fraction}`;
};

export const formatDurationFromSeconds = (seconds: number | undefined) => {
  if (seconds === undefined || seconds <= 0) {
    return "";
  }

  const totalMinutes = Math.round(seconds / 60);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  return parts.join(" ");
};

export const totalRecipeDurationSeconds = (recipe: {
  preparationDuration?: number;
  cookingDuration?: number;
  customDuration?: number;
}) => {
  return (
    (recipe.preparationDuration ?? 0) + (recipe.cookingDuration ?? 0) + (recipe.customDuration ?? 0)
  );
};
