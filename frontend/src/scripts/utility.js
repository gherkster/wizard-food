import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

export function capitalizeFirstChar(string) {
  if (string === null || string === "") return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDurations(timespans) {
  let totalDays = 0;
  let totalHours = 0;
  let totalMinutes = 0;
  timespans.forEach((timespan) => {
    totalDays += timespan.days;
    totalHours += timespan.hours;
    totalMinutes += timespan.minutes;
  });

  dayjs.extend(duration);
  let dur = dayjs.duration(0);
  dur = dur.add(totalDays, "day").add(totalHours, "hour").add(totalMinutes, "minute");

  const formatStrings = [];
  if (totalDays > 0) formatStrings.push("D[d]");
  if (totalHours > 0) formatStrings.push("H[h]");
  if (totalMinutes > 0) formatStrings.push("m[m]");
  if (formatStrings.length === 0) return null;

  return dur.format(formatStrings.join(" "));
}
