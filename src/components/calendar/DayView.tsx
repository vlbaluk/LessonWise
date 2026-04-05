import type { DisplayLesson, Student, TimeBounds } from "@/types";
import { formatDayName, formatMonthDay } from "@/utils/calendar";
import { getLessonsForDay } from "@/utils/lessons";
import { DayColumn } from "./DayColumn";
import { TimeGrid } from "./TimeGrid";

interface DayViewProps {
  activeDate: Date;
  lessons: DisplayLesson[];
  timeBounds: TimeBounds;
  studentsById: Record<string, Student>;
  onSelectLesson: (lesson: DisplayLesson) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  canPrevDay: boolean;
  canNextDay: boolean;
}

export const DayView = ({
  activeDate,
  lessons,
  timeBounds,
  studentsById,
  onSelectLesson,
  onPrevDay,
  onNextDay,
  canPrevDay,
  canNextDay,
}: DayViewProps) => (
  <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-xl backdrop-blur">
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 py-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Day view
        </p>
        <p className="text-lg font-semibold text-slate-900">
          {formatDayName(activeDate)} · {formatMonthDay(activeDate)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevDay}
          disabled={!canPrevDay}
          className="h-9 w-9 rounded-full border border-slate-200 bg-white text-base text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous day"
        >
          &larr;
        </button>
        <button
          type="button"
          onClick={onNextDay}
          disabled={!canNextDay}
          className="h-9 w-9 rounded-full border border-slate-200 bg-white text-base text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next day"
        >
          &rarr;
        </button>
      </div>
    </div>
    <div className="grid grid-cols-[80px_1fr]">
      <div className="border-r border-slate-200 bg-white/60">
        <TimeGrid
          startMinutes={timeBounds.startMinutes}
          slotCount={timeBounds.slotCount}
        />
      </div>
      <DayColumn
        lessons={getLessonsForDay(lessons, activeDate)}
        timeBounds={timeBounds}
        studentsById={studentsById}
        onSelectLesson={onSelectLesson}
      />
    </div>
  </div>
);
