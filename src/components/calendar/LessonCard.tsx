import type { CSSProperties } from "react";
import type { DisplayLesson, PositionedLesson, Student } from "@/types";
import type { StudentColor } from "@/utils/colors";
import { formatMonthDay, formatTime, parseLessonDate } from "@/utils/calendar";

interface LessonCardProps {
  lesson: PositionedLesson;
  student: Student;
  color: StudentColor;
  onSelect: (lesson: DisplayLesson) => void;
  style: CSSProperties;
}

export const LessonCard = ({
  lesson,
  student,
  color,
  onSelect,
  style,
}: LessonCardProps) => {
  const isCancelled = lesson.displayStatus === "cancelled";
  const isRescheduledOriginal = lesson.displayStatus === "rescheduled-original";
  const isRescheduledNew = lesson.displayStatus === "rescheduled-new";
  const isCompact = lesson.columnCount > 1;

  const badge = isCancelled
    ? "Cancelled"
    : isRescheduledOriginal || isRescheduledNew
      ? "Rescheduled"
      : null;

  const rescheduleTarget = lesson.rescheduledTo
    ? parseLessonDate(lesson.rescheduledTo)
    : null;
  const rescheduleSource = lesson.rescheduledFrom
    ? parseLessonDate(lesson.rescheduledFrom)
    : null;

  const statusClasses = isCancelled
    ? "border-rose-200 bg-rose-50/80 text-rose-900"
    : isRescheduledOriginal
      ? `${color.bg} text-slate-700 opacity-60 border-dashed`
      : `${color.bg} ${color.text}`;

  const paddingClasses = isCompact ? "px-2 py-1.5" : "px-3 py-2.5";
  const textClasses = isCompact ? "text-[10px] leading-tight" : "text-[11px]";
  const statusLabel = isCancelled
    ? "Cancelled"
    : isRescheduledOriginal || isRescheduledNew
      ? "Rescheduled"
      : "Scheduled";
  const rescheduleDetails = isRescheduledOriginal && rescheduleTarget
    ? `Moved to ${formatMonthDay(rescheduleTarget)} ${formatTime(rescheduleTarget)}`
    : isRescheduledNew && rescheduleSource
      ? `From ${formatMonthDay(rescheduleSource)} ${formatTime(rescheduleSource)}`
      : null;
  const ariaLabel = [
    `${student.name} · ${lesson.subject}`,
    `${formatMonthDay(lesson.start)} ${formatTime(lesson.start)}–${formatTime(lesson.end)}`,
    statusLabel,
    rescheduleDetails,
    lesson.cancellationReason ? `Reason: ${lesson.cancellationReason}` : null,
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <button
      type="button"
      onClick={() => onSelect(lesson)}
      style={style}
      aria-label={ariaLabel}
      className={`absolute flex flex-col gap-1 rounded-xl border border-slate-200 border-l-4 ${color.leftBorder} ${paddingClasses} ${textClasses} text-left shadow-sm transition hover:-translate-y-[1px] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${statusClasses}`}
    >
      <div className="flex items-center justify-end">
        {badge ? (
          <span
            className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold ${
              isCancelled
                ? "bg-rose-500 text-white"
                : "bg-amber-500 text-amber-50"
            }`}
            aria-label={isCancelled ? "Cancelled lesson" : "Rescheduled lesson"}
            title={isCancelled ? "Cancelled lesson" : "Rescheduled lesson"}
          >
            {isCancelled ? "×" : "↺"}
          </span>
        ) : null}
      </div>
    </button>
  );
};
