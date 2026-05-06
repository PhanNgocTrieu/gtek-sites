"use client";

import { useId, useState } from "react";
import Card from "@/components/ui/Card";

export type WhyGtekItem = { _key?: string; title: string; body: string };

/** From this count upward, the grid starts collapsed (first `COLLAPSED_VISIBLE` items only). */
const EXPAND_THRESHOLD = 5;
const COLLAPSED_VISIBLE = 4;

export function WhyGtekItems({ items }: { items: WhyGtekItem[] }) {
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);

  const useCollapse = items.length >= EXPAND_THRESHOLD;
  const visibleItems =
    useCollapse && !expanded ? items.slice(0, COLLAPSED_VISIBLE) : items;
  const extraCount = Math.max(0, items.length - COLLAPSED_VISIBLE);

  return (
    <div className="mt-10">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        id={panelId}
      >
        {visibleItems.map((v, i) => (
          <Card
            key={v._key ?? `why-${i}`}
            className="p-6 hover:-translate-y-1 hover:shadow-md dark:hover:border-slate-600 dark:hover:bg-slate-800/60"
          >
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-200">
              {v.title}
            </h3>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed dark:text-slate-400">
              {v.body}
            </p>
          </Card>
        ))}
      </div>

      {useCollapse ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-gtek-navy shadow-sm transition hover:bg-slate-50 active:bg-slate-100 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:active:bg-slate-600"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? (
              "Show fewer items"
            ) : (
              <>
                Show {extraCount} more {extraCount === 1 ? "item" : "items"}
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
