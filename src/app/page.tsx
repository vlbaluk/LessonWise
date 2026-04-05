"use client";

import { addDays, isSameDay } from "date-fns";
import { useMemo, useState } from "react";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { DayView } from "@/components/calendar/DayView";
import { LessonDetailModal } from "@/components/calendar/LessonDetailModal";
import { WeekView } from "@/components/calendar/WeekView";
import { FilterBar } from "@/components/filters/FilterBar";
import { Legend } from "@/components/Legend";
import { lessons, parent, students } from "@/data";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useFilters } from "@/hooks/useFilters";
import type { DisplayLesson, Student } from "@/types";
import { formatWeekRange } from "@/utils/calendar";
import { buildDisplayLessons, filterLessons, getTimeBounds } from "@/utils/lessons";

const displayLessons = buildDisplayLessons(lessons);
const studentsById = students.reduce(
  (acc, student) => ({ ...acc, [student.id]: student }),
  {} as Record<string, Student>,
);

export default function Home() {
  const {
    selectedStudentIds,
    selectedStatuses,
    toggleStudent,
    toggleStatus,
    resetAll,
  } = useFilters(students);

  const navigation = useCalendarNavigation(displayLessons);

  const filteredLessons = filterLessons(
    displayLessons,
    selectedStudentIds,
    selectedStatuses,
  );

  const weekEnd = useMemo(
    () => addDays(navigation.weekStart, 7),
    [navigation.weekStart],
  );

  const weekLessonsAll = displayLessons.filter(
    (lesson) => lesson.start >= navigation.weekStart && lesson.start < weekEnd,
  );

  const weekLessons = useMemo(
    () =>
      filteredLessons.filter(
        (lesson) => lesson.start >= navigation.weekStart && lesson.start < weekEnd,
      ),
    [filteredLessons, navigation.weekStart, weekEnd],
  );

  const weekTimeBounds = useMemo(
    () => getTimeBounds(weekLessonsAll),
    [weekLessonsAll],
  );

  const dayLessonsAll = displayLessons.filter((lesson) =>
    isSameDay(lesson.start, navigation.activeDate),
  );

  const dayTimeBounds = useMemo(
    () =>
      getTimeBounds(
        dayLessonsAll,
        weekTimeBounds.startMinutes,
        weekTimeBounds.endMinutes,
      ),
    [dayLessonsAll, weekTimeBounds],
  );

  const [selectedLesson, setSelectedLesson] = useState<DisplayLesson | null>(
    null,
  );
  const selectedStudent = selectedLesson
    ? studentsById[selectedLesson.studentId]
    : null;

  return (
    <div className="min-h-screen px-4 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <CalendarHeader
          parentName={parent.name}
          weekLabel={formatWeekRange(navigation.weekStart)}
          onPrevWeek={navigation.goPrevWeek}
          onNextWeek={navigation.goNextWeek}
          canPrevWeek={navigation.canPrevWeek}
          canNextWeek={navigation.canNextWeek}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div className="hidden md:block animate-fade-up">
              <WeekView
                weekStart={navigation.weekStart}
                lessons={weekLessons}
                timeBounds={weekTimeBounds}
                studentsById={studentsById}
                onSelectLesson={setSelectedLesson}
              />
            </div>
            <div className="md:hidden animate-fade-up">
              <DayView
                activeDate={navigation.activeDate}
                lessons={filteredLessons}
                timeBounds={dayTimeBounds}
                studentsById={studentsById}
                onSelectLesson={setSelectedLesson}
                onPrevDay={navigation.goPrevDay}
                onNextDay={navigation.goNextDay}
                canPrevDay={navigation.canPrevDay}
                canNextDay={navigation.canNextDay}
              />
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <FilterBar
              students={students}
              selectedStudentIds={selectedStudentIds}
              selectedStatuses={selectedStatuses}
              onToggleStudent={toggleStudent}
              onToggleStatus={toggleStatus}
              onReset={resetAll}
            />
            <Legend students={students} />
            <div className="rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                This week
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {weekLessons.length}
              </p>
              <p className="text-sm text-slate-500">lessons visible in the current week</p>
            </div>
          </aside>
        </div>
      </div>

      <LessonDetailModal
        lesson={selectedLesson}
        student={selectedStudent}
        onClose={() => setSelectedLesson(null)}
      />
    </div>
  );
}
