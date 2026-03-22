import duration, { type Duration } from "dayjs/plugin/duration";
import dayjs from "dayjs";

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
  preparationDuration?: number | null;
  cookingDuration?: number | null;
  customDuration?: number | null;
};

export const recipeTotalDuration = (recipe: RecipeDuration) => {
  const sumDuration =
    (recipe.preparationDuration ?? 0) +
    (recipe.cookingDuration ?? 0) +
    (recipe.customDuration ?? 0);

  return secondsToDuration(sumDuration);
};
