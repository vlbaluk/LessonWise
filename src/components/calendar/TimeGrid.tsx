import { format } from "date-fns";
import { SLOT_MINUTES, SLOT_HEIGHT } from "@/constants";

interface TimeGridProps {
  startMinutes: number;
  slotCount: number;
}

const formatLabel = (minutesIntoDay: number) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setMinutes(minutesIntoDay);
  return format(date, "h a");
};

export const TimeGrid = ({ startMinutes, slotCount }: TimeGridProps) => (
  <div className="relative h-full w-20 pr-3 text-right">
    <div
      className="absolute inset-0 grid"
      style={{ gridTemplateRows: `repeat(${slotCount}, ${SLOT_HEIGHT}px)` }}
    >
      {Array.from({ length: slotCount }).map((_, index) => (
        <div
          key={index}
          className="border-t border-dashed border-slate-200"
        />
      ))}
    </div>
    <div
      className="relative flex flex-col"
      style={{ height: slotCount * SLOT_HEIGHT }}
    >
      {Array.from({ length: slotCount }).map((_, index) => {
        const minutes = startMinutes + index * SLOT_MINUTES;
        const isHour = minutes % 60 === 0;
        return (
          <div
            key={index}
            className="flex items-start justify-end"
            style={{ height: SLOT_HEIGHT }}
          >
            {isHour ? (
              <span className="text-[11px] font-semibold text-slate-500">
                {formatLabel(minutes)}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  </div>
);
