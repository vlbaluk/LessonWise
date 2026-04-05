import { addDays, addWeeks, isAfter, isBefore } from "date-fns";
import { useMemo, useState } from "react";
import type { DisplayLesson } from "@/types";
import { getWeekStart } from "@/utils/calendar";

export const useCalendarNavigation = (lessons: DisplayLesson[]) => {
  const { minDate, maxDate } = useMemo(() => {
    if (!lessons.length) {
      const today = new Date();
      return { minDate: today, maxDate: today };
    }
    const starts = lessons.map((lesson) => lesson.start.getTime());
    const ends = lessons.map((lesson) => lesson.end.getTime());
    return {
      minDate: new Date(Math.min(...starts)),
      maxDate: new Date(Math.max(...ends)),
    };
  }, [lessons]);

  const [activeDate, setActiveDate] = useState<Date>(minDate);

  const weekStart = useMemo(() => getWeekStart(activeDate), [activeDate]);

  const canPrevDay = isAfter(activeDate, minDate);
  const canNextDay = isBefore(activeDate, maxDate);

  const canPrevWeek = isAfter(weekStart, getWeekStart(minDate));
  const canNextWeek = isBefore(weekStart, getWeekStart(maxDate));

  const goPrevWeek = () => {
    if (!canPrevWeek) return;
    setActiveDate((prev) => addWeeks(prev, -1));
  };

  const goNextWeek = () => {
    if (!canNextWeek) return;
    setActiveDate((prev) => addWeeks(prev, 1));
  };

  const goPrevDay = () => {
    if (!canPrevDay) return;
    setActiveDate((prev) => addDays(prev, -1));
  };

  const goNextDay = () => {
    if (!canNextDay) return;
    setActiveDate((prev) => addDays(prev, 1));
  };

  return {
    activeDate,
    setActiveDate,
    weekStart,
    minDate,
    maxDate,
    canPrevDay,
    canNextDay,
    canPrevWeek,
    canNextWeek,
    goPrevDay,
    goNextDay,
    goPrevWeek,
    goNextWeek,
  };
};
