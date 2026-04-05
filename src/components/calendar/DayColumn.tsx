import type { DisplayLesson, Student, TimeBounds } from "@/types";
import { SLOT_HEIGHT, SLOT_MINUTES } from "@/constants";
import { assignColumns } from "@/utils/lessons";
import { getMinutesIntoDay } from "@/utils/calendar";
import { getStudentColor } from "@/utils/colors";
import { LessonCard } from "./LessonCard";

interface DayColumnProps {
  lessons: DisplayLesson[];
  timeBounds: TimeBounds;
  studentsById: Record<string, Student>;
  onSelectLesson: (lesson: DisplayLesson) => void;
}

export const DayColumn = ({
  lessons,
  timeBounds,
  studentsById,
  onSelectLesson,
}: DayColumnProps) => {
  const positioned = assignColumns(lessons);
  const height = timeBounds.slotCount * SLOT_HEIGHT;
  const columnGap = 8;

  return (
    <div className="relative border-l border-slate-200 px-2">
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateRows: `repeat(${timeBounds.slotCount}, ${SLOT_HEIGHT}px)` }}
      >
        {Array.from({ length: timeBounds.slotCount }).map((_, index) => (
          <div
            key={index}
            className={`border-t ${
              index % 2 === 0 ? "border-slate-200" : "border-slate-100"
            }`}
          />
        ))}
      </div>
      <div className="relative" style={{ height }}>
        {positioned.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
            No lessons
          </div>
        ) : null}
        {positioned.map((lesson) => {
          const startMinutes = getMinutesIntoDay(lesson.start);
          const endMinutes = getMinutesIntoDay(lesson.end);
          const minutesFromStart = startMinutes - timeBounds.startMinutes;
          const duration = endMinutes - startMinutes;

          const top = (minutesFromStart / SLOT_MINUTES) * SLOT_HEIGHT;
          const cardHeight = (duration / SLOT_MINUTES) * SLOT_HEIGHT;
          const widthPercent = 100 / lesson.columnCount;
          const leftPercent = widthPercent * lesson.column;

          const style = {
            top,
            height: cardHeight,
            left: `calc(${leftPercent}% + ${columnGap / 2}px)`,
            width: `calc(${widthPercent}% - ${columnGap}px)`,
          };

          const student = studentsById[lesson.studentId];
          const color = getStudentColor(lesson.studentId);

          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              student={student}
              color={color}
              onSelect={onSelectLesson}
              style={style}
            />
          );
        })}
      </div>
    </div>
  );
};
