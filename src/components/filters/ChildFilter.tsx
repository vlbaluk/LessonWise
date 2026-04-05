import type { Student } from "@/types";
import { getStudentColor } from "@/utils/colors";

interface ChildFilterProps {
  students: Student[];
  selectedStudentIds: string[];
  onToggle: (studentId: string) => void;
}

export const ChildFilter = ({
  students,
  selectedStudentIds,
  onToggle,
}: ChildFilterProps) => (
  <div className="flex flex-wrap gap-2">
    {students.map((student) => {
      const color = getStudentColor(student.id);
      const isSelected = selectedStudentIds.includes(student.id);
      return (
        <button
          key={student.id}
          type="button"
          onClick={() => onToggle(student.id)}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isSelected
              ? `${color.bg} ${color.border} ${color.text} ring-1 ${color.ring}`
              : "border-slate-200 bg-white/70 text-slate-500 hover:text-slate-700"
          }`}
          aria-pressed={isSelected}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${color.dot} ${
              isSelected ? "opacity-100" : "opacity-40"
            }`}
          />
          {student.name.split(" ")[0]}
        </button>
      );
    })}
  </div>
);
