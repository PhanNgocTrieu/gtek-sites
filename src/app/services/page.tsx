import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { serviceGroupsQuery } from "@/sanity/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Geotechnical engineering, dam safety & instrumentation support, construction support, and materials testing services in Winnipeg, Manitoba.",
};

const serviceGroups = [
  {
    title: "Geotechnical Engineering",
    items: [
      "Geotechnical investigations & reporting",
      "Subsurface exploration planning",
      "Soil and rock characterization",
      "Foundation recommendations (shallow & deep)",
      "Excavation support and shoring guidance",
      "Slope stability assessments",
      "Embankment and earthworks design support",
      "Pavement subgrade evaluation",
      "Ground improvement recommendations",
      "Seismic site considerations (where applicable)",
      "Construction-phase geotechnical review",
      "Peer review / third-party review support",
    ],
  },
  {
    title: "Dam Safety, Instrumentation & Management",
    items: [
      "Dam safety reviews and assessments",
      "Instrumentation selection and layout",
      "Piezometer and monitoring program support",
      "Data interpretation and performance trending",
      "Risk-informed recommendations and reporting",
      "Emergency preparedness support (EPP inputs)",
      "Operations, maintenance, and surveillance inputs",
      "Inspection support and field oversight",
      "Regulatory documentation support",
    ],
  },
  {
    title: "Project Administration & Construction Support",
    items: [
      "Field coordination and schedule alignment",
      "Contractor / stakeholder coordination",
      "RFI and technical clarification support",
      "Construction documentation and reporting",
    ],
  },
  {
    title: "Material Testing",
    items: [
      "Compaction testing and verification",
      "Concrete testing (as required)",
      "Aggregate sampling and testing support",
      "QA/QC documentation for compliance",
    ],
  },
] as const;

export default async function ServicesPage() {
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();
  const preview = cookieStore.get("sanityPreview")?.value;

  const fetchModule = await import("@/sanity/fetch");
  const sanityGroups = preview
    ? await fetchModule.sanityFetchDraft<Array<{ title: string; items: string[] }>>(serviceGroupsQuery, {}, 0)
    : await fetchModule.sanityFetchPublished<Array<{ title: string; items: string[] }>>(serviceGroupsQuery, {}, 60);

  return (
    <main>
      <Section className="bg-gradient-to-b from-slate-50 to-white py-16 dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-4xl">
          <Badge>Services</Badge>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gtek-navy dark:text-slate-200 md:text-5xl">
            Practical, field-ready services
          </h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed dark:text-slate-400">
            GTek supports owners, engineers, and contractors with geotechnical consulting, dam safety support,
            project administration, and materials testing.
          </p>
        </div>
      </Section>

      <Section className="bg-white py-14 dark:bg-slate-950">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(sanityGroups ?? serviceGroups).map((group) => (
            <Card key={group.title} className="p-6 hover:-translate-y-1 hover:shadow-md">
              <details className="group">
                <summary className="cursor-pointer list-none select-none flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gtek-navy dark:text-slate-200">{group.title}</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{group.items.length} offerings</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition-transform group-open:rotate-180 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="mt-5">
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-400">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-gtek-amber shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
