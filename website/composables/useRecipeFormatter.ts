import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

export function useRecipeFormatter() {
  return {
    formatIngredient(ingredient: { amount?: number | string; name: string; unit?: string; note?: string }) {
      const amount = ingredient.amount?.toString() ?? "";
      const unit = ingredient.unit?.toString() ?? "";
      const note = ingredient.note ?? "";

      const value = `${amount} ${unit} ${ingredient.name} ${note}`;
      return value.trim();
    },
    formatMinutesAsDuration(seconds: number) {
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
    },
  };
}
