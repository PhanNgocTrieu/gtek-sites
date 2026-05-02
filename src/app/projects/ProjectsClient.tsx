"use client";

import { useMemo, useState } from "react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

export type ProjectCategory =
  | "Dam Safety"
  | "Mining"
  | "Foundations"
  | "Slope Stability"
  | "Other";

export type Project = {
  title: string;
  sector: ProjectCategory;
  client?: string;
  location?: string;
  scope: string;
  attribution?: string;
  image?: string;
  legacyCategory?: string;
};

const categories: Array<"All" | ProjectCategory> = [
  "All",
  "Dam Safety",
  "Mining",
  "Foundations",
  "Slope Stability",
  "Other",
];

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active ? "bg-gtek-navy text-white" : "bg-white text-slate-800 hover:bg-slate-50 border border-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [active, setActive] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(() => {
    if (active === "All") return initialProjects;
    return initialProjects.filter((p) => p.sector === active);
  }, [active, initialProjects]);

  return (
    <>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Badge>Projects</Badge>
          <p className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filtered.length}</span> projects
          </p>
        </div>
        <div className="sm:hidden">
          <label className="text-sm font-semibold text-slate-700">
            Category
            <select
              className="mt-2 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              value={active}
              onChange={(e) => setActive(e.target.value as (typeof categories)[number])}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 hidden sm:flex flex-wrap gap-2">
        {categories.map((c) => (
          <FilterButton key={c} active={active === c} onClick={() => setActive(c)}>
            {c}
          </FilterButton>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <Card key={`${p.sector}:${p.title}`} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-[16/9] w-full bg-slate-100">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center px-6">
                    <p className="text-sm font-semibold text-slate-700">Project image</p>
                    <p className="mt-1 text-xs text-slate-500">16:9 landscape</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project</p>
                <span className="inline-flex items-center rounded-full bg-gtek-navy/10 px-3 py-1 text-xs font-semibold text-gtek-navy">
                  {p.sector}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-slate-900 leading-snug">{p.title}</h3>
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                {p.client ? (
                  <p>
                    <span className="font-semibold">Client:</span> {p.client}
                  </p>
                ) : null}
                {p.location ? (
                  <p>
                    <span className="font-semibold">Location:</span> {p.location}
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm text-slate-600 leading-relaxed">{p.scope}</p>
              {p.attribution ? <p className="mt-4 text-xs text-slate-500">{p.attribution}</p> : null}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

