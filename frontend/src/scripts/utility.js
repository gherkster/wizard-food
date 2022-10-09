import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

export function capitalizeFirstChar(string) {
  if (string === null || string === "") return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDuration() {
  const durations = Array.prototype.slice.call(arguments);

  let totalDays = 0;
  let totalHours = 0;
  let totalMinutes = 0;
  durations.forEach((duration) => {
    totalDays += duration.days;
    totalHours += duration.hours;
    totalMinutes += duration.minutes;
  });

  dayjs.extend(duration);
  let dur = dayjs.duration(0);
  dur = dur.add(totalDays, "day").add(totalHours, "hour").add(totalMinutes, "minute");

  const formatStrings = [];
  if (totalDays > 0) formatStrings.push("D [days]");
  if (totalHours > 0) formatStrings.push("H [hrs]");
  if (totalMinutes > 0) formatStrings.push("m [mins]");
  if (formatStrings.length === 0) return null;

  return dur.format(formatStrings.join(" "));
}
