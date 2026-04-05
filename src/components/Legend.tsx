import type { Student } from "@/types";
import { getStudentColor } from "@/utils/colors";

interface LegendProps {
  students: Student[];
}

export const Legend = ({ students }: LegendProps) => (
  <div className="flex flex-wrap gap-3 rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm backdrop-blur">
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
      Legend
    </span>
    {students.map((student) => {
      const color = getStudentColor(student.id);
      return (
        <div key={student.id} className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${color.dot}`} />
          <span className="font-semibold text-slate-700">
            {student.name.split(" ")[0]}
          </span>
        </div>
      );
    })}
  </div>
);
