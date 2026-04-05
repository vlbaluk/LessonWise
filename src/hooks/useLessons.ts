import { useCallback, useMemo, useState } from "react";
import { lessons as initialLessons } from "@/data";
import type { Lesson } from "@/types";
import { buildDisplayLessons } from "@/utils/lessons";

interface BookLessonInput {
  studentId: string;
  subject: string;
  startsAt: string;
  endsAt: string;
  tutor?: string;
}

export const useLessons = () => {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);

  const displayLessons = useMemo(
    () => buildDisplayLessons(lessons),
    [lessons],
  );

  const getTutorForStudentSubject = useCallback(
    (studentId: string, subject: string) => {
      const normalized = subject.trim().toLowerCase();
      for (let i = lessons.length - 1; i >= 0; i -= 1) {
        const lesson = lessons[i];
        if (
          lesson.studentId === studentId &&
          lesson.subject.trim().toLowerCase() === normalized
        ) {
          return lesson.tutor;
        }
      }
      return undefined;
    },
    [lessons],
  );

  const tutors = useMemo(
    () => Array.from(new Set(lessons.map((lesson) => lesson.tutor))).sort(),
    [lessons],
  );

  const bookLesson = useCallback(
    ({ studentId, subject, startsAt, endsAt, tutor }: BookLessonInput) => {
      const resolvedTutor =
        tutor?.trim() || getTutorForStudentSubject(studentId, subject) || "";
      if (!resolvedTutor) {
        return;
      }
      const newLesson: Lesson = {
        id: `l${Date.now()}`,
        studentId,
        subject: subject.trim(),
        tutor: resolvedTutor,
        startsAt,
        endsAt,
        status: "scheduled",
      };
      setLessons((prev) => [...prev, newLesson]);
    },
    [getTutorForStudentSubject],
  );

  const cancelLesson = useCallback(
    (lessonId: string, reason?: string) => {
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === lessonId
            ? {
                ...lesson,
                status: "cancelled",
                cancellationReason: reason?.trim() || undefined,
              }
            : lesson,
        ),
      );
    },
    [],
  );

  const rescheduleLesson = useCallback(
    (lessonId: string, newStartsAt: string, newEndsAt: string) => {
      setLessons((prev) => {
        const target = prev.find((lesson) => lesson.id === lessonId);
        if (!target) return prev;

        const updated = prev.map((lesson) =>
          lesson.id === lessonId
            ? {
                ...lesson,
                status: "rescheduled" as const,
                rescheduledTo: newStartsAt,
                cancellationReason: undefined,
              }
            : lesson,
        );

        const newLesson: Lesson = {
          id: `l${Date.now()}`,
          studentId: target.studentId,
          subject: target.subject,
          tutor: target.tutor,
          startsAt: newStartsAt,
          endsAt: newEndsAt,
          status: "scheduled",
          rescheduledFrom: target.startsAt,
        };

        return [...updated, newLesson];
      });
    },
    [],
  );

  return {
    lessons,
    displayLessons,
    tutors,
    bookLesson,
    cancelLesson,
    rescheduleLesson,
    getTutorForStudentSubject,
  };
};
