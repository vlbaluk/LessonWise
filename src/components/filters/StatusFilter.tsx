import type { StatusFilter as StatusFilterType } from "@/types";
import { statusColors } from "@/utils/colors";

const statusLabels: Record<StatusFilterType, string> = {
  scheduled: "Scheduled",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
};

const statusOutline: Record<StatusFilterType, string> = {
  scheduled: "border-slate-200 text-slate-600",
  rescheduled: "border-amber-200 text-amber-700",
  cancelled: "border-rose-200 text-rose-700",
};

interface StatusFilterProps {
  selectedStatuses: StatusFilterType[];
  onToggle: (status: StatusFilterType) => void;
}

export const StatusFilter = ({
  selectedStatuses,
  onToggle,
}: StatusFilterProps) => (
  <div className="flex flex-wrap gap-2">
    {(Object.keys(statusLabels) as StatusFilterType[]).map((status) => {
      const isSelected = selectedStatuses.includes(status);
      return (
        <button
          key={status}
          type="button"
          onClick={() => onToggle(status)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isSelected
              ? statusColors[status]
              : `bg-white/70 ${statusOutline[status]} hover:text-slate-900`
          }`}
          aria-pressed={isSelected}
        >
          {statusLabels[status]}
        </button>
      );
    })}
  </div>
);
