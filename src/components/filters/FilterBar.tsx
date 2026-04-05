import type { StatusFilter as StatusFilterType, Student } from "@/types";
import { ChildFilter } from "./ChildFilter";
import { StatusFilter } from "./StatusFilter";

interface FilterBarProps {
  students: Student[];
  selectedStudentIds: string[];
  selectedStatuses: StatusFilterType[];
  onToggleStudent: (studentId: string) => void;
  onToggleStatus: (status: StatusFilterType) => void;
  onReset: () => void;
}

export const FilterBar = ({
  students,
  selectedStudentIds,
  selectedStatuses,
  onToggleStudent,
  onToggleStatus,
  onReset,
}: FilterBarProps) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Filters
        </p>
        <p className="text-sm text-slate-600">
          Focus on specific children or lesson statuses.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
      >
        Reset
      </button>
    </div>
    <div className="flex flex-col gap-3">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Children
        </p>
        <ChildFilter
          students={students}
          selectedStudentIds={selectedStudentIds}
          onToggle={onToggleStudent}
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Status
        </p>
        <StatusFilter
          selectedStatuses={selectedStatuses}
          onToggle={onToggleStatus}
        />
      </div>
    </div>
  </div>
);
