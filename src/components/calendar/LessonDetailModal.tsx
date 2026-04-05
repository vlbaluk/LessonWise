import { useEffect } from "react";
import type { DisplayLesson, Student } from "@/types";
import { formatMonthDay, formatTime, parseLessonDate } from "@/utils/calendar";

interface LessonDetailModalProps {
  lesson: DisplayLesson | null;
  student: Student | null;
  onClose: () => void;
}

export const LessonDetailModal = ({
  lesson,
  student,
  onClose,
}: LessonDetailModalProps) => {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!lesson || !student) return null;

  const statusLabel =
    lesson.displayStatus === "cancelled"
      ? "Cancelled"
      : lesson.displayStatus === "rescheduled-new" ||
          lesson.displayStatus === "rescheduled-original"
        ? "Rescheduled"
        : "Scheduled";

  const statusClass =
    lesson.displayStatus === "cancelled"
      ? "bg-rose-500 text-white"
      : lesson.displayStatus === "scheduled"
        ? "bg-slate-900 text-white"
        : "bg-amber-500 text-amber-50";

  const rescheduleTarget = lesson.rescheduledTo
    ? parseLessonDate(lesson.rescheduledTo)
    : null;
  const rescheduleSource = lesson.rescheduledFrom
    ? parseLessonDate(lesson.rescheduledFrom)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div
        className="absolute inset-0 h-full w-full cursor-default"
        role="presentation"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-modal-title"
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white/95 p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Lesson Details
            </p>
            <h2
              id="lesson-modal-title"
              className="font-display text-2xl text-slate-900"
            >
              {lesson.subject}
            </h2>
            <p className="text-sm text-slate-600">{lesson.tutor}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <div className="mt-5 space-y-3 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Status
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
              {statusLabel}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Student
            </span>
            <span className="font-semibold text-slate-900">
              {student.name} (Year {student.year})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Time
            </span>
            <span className="font-semibold text-slate-900">
              {formatMonthDay(lesson.start)} · {formatTime(lesson.start)} - {formatTime(lesson.end)}
            </span>
          </div>
          {lesson.cancellationReason ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3 text-xs text-rose-700">
              Cancellation reason: {lesson.cancellationReason}
            </div>
          ) : null}
          {lesson.displayStatus === "rescheduled-original" && rescheduleTarget ? (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
              New time: {formatMonthDay(rescheduleTarget)} · {formatTime(rescheduleTarget)}
            </div>
          ) : null}
          {lesson.displayStatus === "rescheduled-new" && rescheduleSource ? (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
              Original time: {formatMonthDay(rescheduleSource)} · {formatTime(rescheduleSource)}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
