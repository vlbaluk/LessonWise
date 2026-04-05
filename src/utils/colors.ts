export interface StudentColor {
  base: string;
  bg: string;
  border: string;
  dot: string;
  leftBorder: string;
  text: string;
  ring: string;
  softText: string;
}

const colors: Record<string, StudentColor> = {
  s1: {
    base: "violet",
    bg: "bg-violet-50",
    border: "border-violet-400",
    dot: "bg-violet-400",
    leftBorder: "border-l-violet-400",
    text: "text-violet-900",
    ring: "ring-violet-300",
    softText: "text-violet-700",
  },
  s2: {
    base: "sky",
    bg: "bg-sky-50",
    border: "border-sky-400",
    dot: "bg-sky-400",
    leftBorder: "border-l-sky-400",
    text: "text-sky-900",
    ring: "ring-sky-300",
    softText: "text-sky-700",
  },
  s3: {
    base: "emerald",
    bg: "bg-emerald-50",
    border: "border-emerald-400",
    dot: "bg-emerald-400",
    leftBorder: "border-l-emerald-400",
    text: "text-emerald-900",
    ring: "ring-emerald-300",
    softText: "text-emerald-700",
  },
  s4: {
    base: "amber",
    bg: "bg-amber-50",
    border: "border-amber-400",
    dot: "bg-amber-400",
    leftBorder: "border-l-amber-400",
    text: "text-amber-900",
    ring: "ring-amber-300",
    softText: "text-amber-700",
  },
};

const fallback: StudentColor = {
  base: "slate",
  bg: "bg-slate-50",
  border: "border-slate-300",
  dot: "bg-slate-400",
  leftBorder: "border-l-slate-400",
  text: "text-slate-900",
  ring: "ring-slate-200",
  softText: "text-slate-700",
};

export const getStudentColor = (studentId: string): StudentColor =>
  colors[studentId] ?? fallback;

export const statusColors = {
  scheduled: "bg-slate-900 text-white",
  rescheduled: "bg-amber-500 text-amber-50",
  cancelled: "bg-rose-500 text-rose-50",
};
