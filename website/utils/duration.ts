import dayjs from "dayjs";
import duration, { type Duration } from "dayjs/plugin/duration";

type RecipeDuration = {
  preparationDuration?: number;
  cookingDuration?: number;
  customDuration?: number;
};

export const recipeTotalDuration = (recipe: RecipeDuration) => {
  const sumDuration = (recipe.preparationDuration ?? 0) + (recipe.cookingDuration ?? 0) + (recipe.customDuration ?? 0);

  return secondsToDuration(sumDuration);
};

export const secondsToDuration = (seconds: number): Duration => {
  dayjs.extend(duration);

  return dayjs.duration(seconds, "seconds");
};
