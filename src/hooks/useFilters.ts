import { useMemo, useState } from "react";
import type { StatusFilter, Student } from "@/types";

export const useFilters = (students: Student[]) => {
  const defaultStudentIds = useMemo(
    () => students.map((student) => student.id),
    [students],
  );

  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(
    defaultStudentIds,
  );
  const [selectedStatuses, setSelectedStatuses] = useState<StatusFilter[]>([
    "scheduled",
    "rescheduled",
    "cancelled",
  ]);

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const toggleStatus = (status: StatusFilter) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((value) => value !== status)
        : [...prev, status],
    );
  };

  const resetAll = () => {
    setSelectedStudentIds(defaultStudentIds);
    setSelectedStatuses(["scheduled", "rescheduled", "cancelled"]);
  };

  return {
    selectedStudentIds,
    selectedStatuses,
    toggleStudent,
    toggleStatus,
    resetAll,
  };
};
