import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { serviceGroupsQuery, siteSettingsQuery } from "@/sanity/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Geotechnical engineering, dam safety & instrumentation support, construction support, and materials testing services in Winnipeg, Manitoba.",
};


function toNextImageSrc(src: string | undefined, fallback: string) {
  const raw = (src ?? "").trim() || fallback;
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }
  const withoutPublic = raw.replace(/^\/?public\//, "/");
  return withoutPublic.startsWith("/") ? withoutPublic : `/${withoutPublic}`;
}

const serviceImagesMapping = [
  "", "", "", ""
]

const serviceGroups = [
  {
    title: "Geotechnical Engineering",
    image: serviceImagesMapping[0],
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
    image: serviceImagesMapping[1],
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
    image: serviceImagesMapping[2],
    items: [
      "Field coordination and schedule alignment",
      "Contractor / stakeholder coordination",
      "RFI and technical clarification support",
      "Construction documentation and reporting",
    ],
  },
  {
    title: "Material Testing",
    image: serviceImagesMapping[3],
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
  const settings = preview
    ? await fetchModule.sanityFetchDraft<{ servicesHeroBackground?: string }>(siteSettingsQuery, {}, 0)
    : await fetchModule.sanityFetchPublished<{ servicesHeroBackground?: string }>(siteSettingsQuery, {}, 60);
  const sanityGroups = preview
    ? await fetchModule.sanityFetchDraft<
        Array<{
          title?: string | null;
          image?: string | null;
          items?: Array<
            | string
            | {
                title?: string | null;
                description?: string | null;
                image?: string | null;
              }
            | null
          > | null;
        }>
      >(
        serviceGroupsQuery,
        {},
        0,
      )
    : await fetchModule.sanityFetchPublished<
        Array<{
          title?: string | null;
          image?: string | null;
          items?: Array<
            | string
            | {
                title?: string | null;
                description?: string | null;
                image?: string | null;
              }
            | null
          > | null;
        }>
      >(
        serviceGroupsQuery,
        {},
        60,
      );
  const servicesHeroBackground = settings?.servicesHeroBackground;

  const sourceGroups =
    Array.isArray(sanityGroups) && sanityGroups.length > 0 ? sanityGroups : serviceGroups;

  const groups = sourceGroups
    .filter((group): group is NonNullable<typeof group> => Boolean(group))
    .map((group) => ({
      title: (group.title ?? "").trim(),
      image: group.image ?? "",
      items: (group.items ?? [])
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .map((item) => {
          if (typeof item === "string") {
            return { title: item.trim(), description: "" };
          }
          return {
            title: (item.title ?? "").trim(),
            description: (item.description ?? "").trim(),
          };
        })
        .filter((item) => item.title.length > 0),
    }))
    .filter((group) => group.title.length > 0);

  return (
    <main>
      <Section className={`py-16 ${servicesHeroBackground ? "relative overflow-hidden" : "bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950"}`}>
        {servicesHeroBackground ? (
          <>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${servicesHeroBackground}')` }} aria-hidden />
            <div className="absolute inset-0 bg-white/75 dark:bg-slate-950/75" aria-hidden />
          </>
        ) : null}
        <div className={`max-w-4xl ${servicesHeroBackground ? "relative" : ""}`}>
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
          {groups.map((group) => (
            <Card key={group.title} className="p-6 hover:-translate-y-1 hover:shadow-md">
              <div>
                <h2 className="text-xl font-bold text-gtek-navy dark:text-slate-200">{group.title}</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{group.items.length} offerings</p>
              </div>
              <div className="mt-5">
                {group.image ? (
                  <div className="mb-5 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={group.image} alt={group.title} className="h-44 w-full object-cover" />
                  </div>
                ) : null}
                <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-400">
                  {group.items.map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-gtek-amber shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</p>
                        {item.description ? <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{item.description}</p> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </main>
  );
}
