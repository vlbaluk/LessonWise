import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { Lesson, Student } from "@/types";

interface BookingModalProps {
  isOpen: boolean;
  students: Student[];
  lessons: Lesson[];
  tutors: string[];
  getTutorForStudentSubject: (studentId: string, subject: string) =>
    | string
    | undefined;
  onBook: (data: {
    studentId: string;
    subject: string;
    startsAt: string;
    endsAt: string;
    tutor?: string;
  }) => void;
  onClose: () => void;
}

export const BookingModal = ({
  isOpen,
  students,
  lessons,
  tutors,
  getTutorForStudentSubject,
  onBook,
  onClose,
}: BookingModalProps) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const [studentId, setStudentId] = useState(() => students[0]?.id ?? "");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(`${yyyy}-${mm}-${dd}`);
  const [startTime, setStartTime] = useState("16:00");
  const [endTime, setEndTime] = useState("17:00");
  const [tutor, setTutor] = useState("");

  const subjectsForStudent = useMemo(() => {
    const set = new Set(
      lessons
        .filter((lesson) => lesson.studentId === studentId)
        .map((lesson) => lesson.subject),
    );
    return Array.from(set).sort();
  }, [lessons, studentId]);

  const autoTutor = useMemo(
    () => (subject ? getTutorForStudentSubject(studentId, subject) : undefined),
    [getTutorForStudentSubject, studentId, subject],
  );

  if (!isOpen) return null;

  const isValid = Boolean(
    studentId && subject.trim() && date && startTime && endTime,
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;
    const startsAt = `${date}T${startTime}`;
    const endsAt = `${date}T${endTime}`;
    onBook({
      studentId,
      subject: subject.trim(),
      startsAt,
      endsAt,
      tutor: autoTutor || tutor.trim(),
    });
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
              Book lesson
            </p>
            <h2 className="font-display text-2xl text-slate-900">
              New appointment
            </h2>
            <p className="text-sm text-slate-600">
              Choose student, subject, and time.
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
            Student
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Subject
            <input
              list="subject-options"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              placeholder="e.g. Maths"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
            <datalist id="subject-options">
              {subjectsForStudent.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Date
              <input
                type="date"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Start time
              <input
                type="time"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              End time
              <input
                type="time"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
            </label>
          </div>

          <label className="text-sm font-semibold text-slate-700">
            Tutor
            {autoTutor ? (
              <input
                readOnly
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                value={autoTutor}
              />
            ) : (
              <input
                list="tutor-options"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                placeholder="Choose tutor"
                value={tutor}
                onChange={(event) => setTutor(event.target.value)}
              />
            )}
            <datalist id="tutor-options">
              {tutors.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </label>

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
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Book lesson
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
