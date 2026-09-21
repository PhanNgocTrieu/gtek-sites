import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import { serviceGroupsQuery, servicesPageQuery, siteSettingsQuery } from "@/sanity/queries";
import type { Metadata } from "next";
import { loadCms } from "@/content/loadCms";
import {
  coalesceImage,
  coalesceList,
  coalesceText,
  pageSeo,
  resolveImageSrc,
  siteConfig,
} from "@/content/siteConfig";

type ServicesPageDoc = {
  seoTitle?: string;
  seoDescription?: string;
  badge?: string;
  heroTitle?: string;
  heroSubhead?: string;
  heroBackground?: string;
};

type ServiceGroupDoc = {
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
};

const defaults = siteConfig.services;

function defaultImageForTitle(title: string): string {
  const match = defaults.groups.find((group) => group.title.toLowerCase() === title.toLowerCase());
  return match?.image ?? "";
}

function normalizeGroups(groups: ServiceGroupDoc[] | null | undefined) {
  return (groups ?? [])
    .filter((group): group is NonNullable<typeof group> => Boolean(group))
    .map((group) => {
      const title = (group.title ?? "").trim();
      return {
        title,
        image: resolveImageSrc(group.image ?? undefined, defaultImageForTitle(title)),
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
      };
    })
    .filter((group) => group.title.length > 0);
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadCms<ServicesPageDoc>(servicesPageQuery);
  return pageSeo(page, defaults.seo);
}

export default async function ServicesPage() {
  const [page, settings, sanityGroups] = await Promise.all([
    loadCms<ServicesPageDoc>(servicesPageQuery),
    loadCms<{ servicesHeroBackground?: string }>(siteSettingsQuery),
    loadCms<ServiceGroupDoc[]>(serviceGroupsQuery),
  ]);

  const badge = coalesceText(page?.badge, defaults.badge);
  const heroTitle = coalesceText(page?.heroTitle, defaults.heroTitle);
  const heroSubhead = coalesceText(page?.heroSubhead, defaults.heroSubhead);
  const servicesHeroBackground = coalesceImage(
    page?.heroBackground,
    coalesceImage(settings?.servicesHeroBackground, siteConfig.settings.backgrounds.servicesHeroBackground),
  );

  const groups = coalesceList(
    normalizeGroups(sanityGroups),
    defaults.groups.map((group) => ({
      ...group,
      image: resolveImageSrc(group.image),
    })),
  );

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
          <Badge>{badge}</Badge>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gtek-navy dark:text-slate-200 md:text-5xl">
            {heroTitle}
          </h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed dark:text-slate-400">
            {heroSubhead}
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
