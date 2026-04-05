import { addDays, format, parseISO, startOfWeek } from "date-fns";
import { WEEK_STARTS_ON } from "@/constants";

export const getWeekStart = (date: Date) =>
  startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON });

export const getWeekDays = (weekStart: Date) =>
  Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

export const formatWeekRange = (weekStart: Date) => {
  const end = addDays(weekStart, 6);
  const sameMonth = format(weekStart, "MMM") === format(end, "MMM");
  if (sameMonth) {
    return `${format(weekStart, "MMM d")}–${format(end, "d, yyyy")}`;
  }
  return `${format(weekStart, "MMM d")}–${format(end, "MMM d, yyyy")}`;
};

export const formatDayName = (date: Date) => format(date, "EEE");

export const formatDayNumber = (date: Date) => format(date, "d");

export const formatMonthDay = (date: Date) => format(date, "MMM d");

export const formatTime = (date: Date) => format(date, "h:mm a");

export const getMinutesIntoDay = (date: Date) =>
  date.getHours() * 60 + date.getMinutes();

export const parseLessonDate = (value: string) => {
  const normalized = value.endsWith("Z") ? value.slice(0, -1) : value;
  return parseISO(normalized);
};
