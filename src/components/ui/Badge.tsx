import { type ReactNode } from "react";

export default function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gtek-navy/10 px-3 py-1 text-xs font-semibold text-gtek-navy dark:bg-slate-800 dark:text-slate-300">
      {children}
    </span>
  );
}

