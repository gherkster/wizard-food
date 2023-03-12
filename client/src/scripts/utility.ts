import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { RecipeDuration } from "@/types/recipe";

export function capitalizeFirstChar(string: string) {
  if (string === null || string === "") return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDuration(recipeDuration: RecipeDuration) {
  dayjs.extend(duration);
  let dur = dayjs.duration(0);
  dur = dur.add(recipeDuration.days, "day").add(recipeDuration.hours, "hour").add(recipeDuration.minutes, "minute");

  const formatStrings = [];
  if (recipeDuration.days > 0) formatStrings.push("D[d]");
  if (recipeDuration.hours > 0) formatStrings.push("H[h]");
  if (recipeDuration.minutes > 0) formatStrings.push("m[m]");
  if (formatStrings.length === 0) return null;

  return dur.format(formatStrings.join(" "));
}
