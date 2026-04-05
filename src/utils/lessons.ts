import { isSameDay } from "date-fns";
import {
  DEFAULT_END_MINUTES,
  DEFAULT_START_MINUTES,
  SLOT_MINUTES,
} from "@/constants";
import type {
  DisplayLesson,
  Lesson,
  PositionedLesson,
  StatusFilter,
  TimeBounds,
} from "@/types";
import { getMinutesIntoDay, parseLessonDate } from "@/utils/calendar";

export const buildDisplayLessons = (lessons: Lesson[]): DisplayLesson[] =>
  lessons.map((lesson) => {
    const start = parseLessonDate(lesson.startsAt);
    const end = parseLessonDate(lesson.endsAt);

    if (lesson.status === "rescheduled") {
      return {
        ...lesson,
        start,
        end,
        displayStatus: "rescheduled-original",
        statusForFilter: "rescheduled",
      };
    }

    if (lesson.status === "cancelled") {
      return {
        ...lesson,
        start,
        end,
        displayStatus: "cancelled",
        statusForFilter: "cancelled",
      };
    }

    if (lesson.rescheduledFrom) {
      return {
        ...lesson,
        start,
        end,
        displayStatus: "rescheduled-new",
        statusForFilter: "rescheduled",
      };
    }

    return {
      ...lesson,
      start,
      end,
      displayStatus: "scheduled",
      statusForFilter: "scheduled",
    };
  });

export const filterLessons = (
  lessons: DisplayLesson[],
  studentIds: string[],
  statuses: StatusFilter[],
) =>
  lessons.filter(
    (lesson) =>
      studentIds.includes(lesson.studentId) &&
      statuses.includes(lesson.statusForFilter),
  );

export const getLessonsForDay = (lessons: DisplayLesson[], day: Date) =>
  lessons.filter((lesson) => isSameDay(lesson.start, day));

const sortByStart = (a: DisplayLesson, b: DisplayLesson) => {
  const diff = a.start.getTime() - b.start.getTime();
  if (diff !== 0) return diff;
  return b.end.getTime() - a.end.getTime();
};

export const assignColumns = (lessons: DisplayLesson[]): PositionedLesson[] => {
  if (!lessons.length) return [];

  const sorted = [...lessons].sort(sortByStart);
  const positioned: PositionedLesson[] = [];

  let cluster: DisplayLesson[] = [];
  let clusterEnd: number | null = null;

  const flushCluster = () => {
    if (!cluster.length) return;
    const columnEnds: number[] = [];
    const clusterPositioned: PositionedLesson[] = [];

    cluster.forEach((lesson) => {
      const startTime = lesson.start.getTime();
      let columnIndex = columnEnds.findIndex((end) => startTime >= end);
      if (columnIndex === -1) {
        columnIndex = columnEnds.length;
        columnEnds.push(lesson.end.getTime());
      } else {
        columnEnds[columnIndex] = lesson.end.getTime();
      }

      clusterPositioned.push({
        ...lesson,
        column: columnIndex,
        columnCount: 0,
      });
    });

    const columnCount = columnEnds.length;
    clusterPositioned.forEach((lesson) => {
      positioned.push({ ...lesson, columnCount });
    });

    cluster = [];
    clusterEnd = null;
  };

  sorted.forEach((lesson) => {
    const startTime = lesson.start.getTime();
    const endTime = lesson.end.getTime();

    if (clusterEnd === null || startTime < clusterEnd) {
      cluster.push(lesson);
      clusterEnd = clusterEnd === null ? endTime : Math.max(clusterEnd, endTime);
      return;
    }

    flushCluster();
    cluster.push(lesson);
    clusterEnd = endTime;
  });

  flushCluster();
  return positioned;
};

export const getTimeBounds = (
  lessons: DisplayLesson[],
  fallbackStart = DEFAULT_START_MINUTES,
  fallbackEnd = DEFAULT_END_MINUTES,
): TimeBounds => {
  if (!lessons.length) {
    return {
      startMinutes: fallbackStart,
      endMinutes: fallbackEnd,
      slotCount: Math.ceil((fallbackEnd - fallbackStart) / SLOT_MINUTES),
    };
  }

  const starts = lessons.map((lesson) => getMinutesIntoDay(lesson.start));
  const ends = lessons.map((lesson) => getMinutesIntoDay(lesson.end));

  let min = Math.min(...starts);
  let max = Math.max(...ends);

  min = Math.floor(min / SLOT_MINUTES) * SLOT_MINUTES;
  max = Math.ceil(max / SLOT_MINUTES) * SLOT_MINUTES;

  const minRange = 6 * 60;
  if (max - min < minRange) {
    const pad = Math.ceil((minRange - (max - min)) / 2 / SLOT_MINUTES) *
      SLOT_MINUTES;
    min = Math.max(0, min - pad);
    max = Math.min(24 * 60, max + pad);
  }

  return {
    startMinutes: min,
    endMinutes: max,
    slotCount: Math.ceil((max - min) / SLOT_MINUTES),
  };
};
