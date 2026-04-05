interface CalendarHeaderProps {
  parentName: string;
  weekLabel: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  canPrevWeek: boolean;
  canNextWeek: boolean;
}

export const CalendarHeader = ({
  parentName,
  weekLabel,
  onPrevWeek,
  onNextWeek,
  canPrevWeek,
  canNextWeek,
}: CalendarHeaderProps) => (
  <div className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          LessonWise Parent Calendar
        </p>
        <h1 className="font-display text-3xl text-slate-900">
          {parentName}&rsquo;s Week
        </h1>
        <p className="text-sm text-slate-500">
          Times shown as provided (local school time).
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevWeek}
          disabled={!canPrevWeek}
          className="h-10 w-10 rounded-full border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous week"
        >
          &larr;
        </button>
        <div className="rounded-full border border-slate-200 bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          {weekLabel}
        </div>
        <button
          type="button"
          onClick={onNextWeek}
          disabled={!canNextWeek}
          className="h-10 w-10 rounded-full border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next week"
        >
          &rarr;
        </button>
      </div>
    </div>
  </div>
);
