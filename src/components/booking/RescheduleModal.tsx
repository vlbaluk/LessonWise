import { format } from "date-fns";
import { useState } from "react";
import type { FormEvent } from "react";
import type { DisplayLesson, Student } from "@/types";
import { formatMonthDay, formatTime } from "@/utils/calendar";

interface RescheduleModalProps {
  isOpen: boolean;
  lesson: DisplayLesson | null;
  student: Student | null;
  onReschedule: (lessonId: string, startsAt: string, endsAt: string) => void;
  onClose: () => void;
}

export const RescheduleModal = ({
  isOpen,
  lesson,
  student,
  onReschedule,
  onClose,
}: RescheduleModalProps) => {
  const [date, setDate] = useState(() =>
    lesson ? format(lesson.start, "yyyy-MM-dd") : "",
  );
  const [startTime, setStartTime] = useState(() =>
    lesson ? format(lesson.start, "HH:mm") : "",
  );
  const [endTime, setEndTime] = useState(() =>
    lesson ? format(lesson.end, "HH:mm") : "",
  );

  if (!isOpen || !lesson || !student) return null;

  const isValid = Boolean(date && startTime && endTime);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;
    onReschedule(lesson.id, `${date}T${startTime}`, `${date}T${endTime}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div
        className="absolute inset-0 h-full w-full cursor-default"
        role="presentation"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/70 bg-white/95 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Reschedule
            </p>
            <h2 className="font-display text-2xl text-slate-900">
              {lesson.subject}
            </h2>
            <p className="text-sm text-slate-600">
              {student.name} · {formatMonthDay(lesson.start)} · {formatTime(lesson.start)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <label className="text-sm font-semibold text-slate-700">
            New date
            <input
              type="date"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              New start time
              <input
                type="time"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              New end time
              <input
                type="time"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
            </label>
          </div>
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-amber-50 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reschedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
