export type LessonStatus = "scheduled" | "rescheduled" | "cancelled";

export type StatusFilter = LessonStatus;

export interface Parent {
  name: string;
}

export interface Student {
  id: string;
  name: string;
  year: number;
}

export interface Lesson {
  id: string;
  studentId: string;
  subject: string;
  tutor: string;
  startsAt: string;
  endsAt: string;
  status: LessonStatus;
  rescheduledTo?: string;
  rescheduledFrom?: string;
  cancellationReason?: string;
}

export type DisplayStatus =
  | "scheduled"
  | "cancelled"
  | "rescheduled-original"
  | "rescheduled-new";

export interface DisplayLesson extends Lesson {
  displayStatus: DisplayStatus;
  statusForFilter: StatusFilter;
  start: Date;
  end: Date;
}

export interface PositionedLesson extends DisplayLesson {
  column: number;
  columnCount: number;
}

export interface TimeBounds {
  startMinutes: number;
  endMinutes: number;
  slotCount: number;
}
