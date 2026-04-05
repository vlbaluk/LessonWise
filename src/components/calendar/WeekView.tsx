import type { DisplayLesson, Student, TimeBounds } from "@/types";
import { getWeekDays, formatDayName, formatDayNumber } from "@/utils/calendar";
import { getLessonsForDay } from "@/utils/lessons";
import { DayColumn } from "./DayColumn";
import { TimeGrid } from "./TimeGrid";

interface WeekViewProps {
  weekStart: Date;
  lessons: DisplayLesson[];
  timeBounds: TimeBounds;
  studentsById: Record<string, Student>;
  onSelectLesson: (lesson: DisplayLesson) => void;
}

export const WeekView = ({
  weekStart,
  lessons,
  timeBounds,
  studentsById,
  onSelectLesson,
}: WeekViewProps) => {
  const weekDays = getWeekDays(weekStart);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-xl backdrop-blur">
      <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b border-slate-200 bg-white/80">
        <div className="px-3 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Time
        </div>
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="px-3 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {formatDayName(day)}
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {formatDayNumber(day)}
            </p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))]">
        <div className="border-r border-slate-200 bg-white/60">
          <TimeGrid
            startMinutes={timeBounds.startMinutes}
            slotCount={timeBounds.slotCount}
          />
        </div>
        {weekDays.map((day) => (
          <DayColumn
            key={day.toISOString()}
            lessons={getLessonsForDay(lessons, day)}
            timeBounds={timeBounds}
            studentsById={studentsById}
            onSelectLesson={onSelectLesson}
          />
        ))}
      </div>
    </div>
  );
};
