import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import type { Metadata } from "next";
import { aboutPageQuery } from "@/sanity/queries";
import { loadCms } from "@/content/loadCms";
import {
  coalesceImage,
  coalesceList,
  coalesceText,
  pageSeo,
  siteConfig,
} from "@/content/siteConfig";

type AboutPageDoc = {
  seoTitle?: string;
  seoDescription?: string;
  heroTitle?: string;
  heroBackgroundImage?: string;
  teamIntro?: string;
  narrativeItems?: Array<{
    title: string;
    subtitle: string;
  }>;
  narrative?: string[];
  teamMembers?: Array<{
    name: string;
    title: string;
    credentials?: string;
    bio: string;
    photo?: string;
    showPhoto?: boolean;
  }>;
  affiliations?: string[];
};

const defaults = siteConfig.about;

export async function generateMetadata(): Promise<Metadata> {
  const about = await loadCms<AboutPageDoc>(aboutPageQuery);
  return pageSeo(about, defaults.seo);
}

export default async function AboutPage() {
  const about = await loadCms<AboutPageDoc>(aboutPageQuery);
  const narrativeItemsFromLegacy = about?.narrative?.map((text, idx) => ({
    title: defaults.narrativeItems[idx]?.title ?? `Section ${idx + 1}`,
    subtitle: text,
  }));

  const narrativeItems = coalesceList(
    about?.narrativeItems?.filter((item) => item?.title && item?.subtitle),
    coalesceList(narrativeItemsFromLegacy, defaults.narrativeItems),
  );

  const team = coalesceList(
    about?.teamMembers?.filter((member) => member?.name && member?.bio),
    defaults.teamMembers,
  );

  const affiliations = coalesceList(about?.affiliations, defaults.affiliations);
  const heroBackgroundImage = coalesceImage(about?.heroBackgroundImage, defaults.heroBackgroundImage);
  const heroTitle = coalesceText(about?.heroTitle, defaults.heroTitle);
  const teamIntro = coalesceText(about?.teamIntro, defaults.teamIntro);

  return (
    <main>
      <Section className="relative overflow-hidden py-16">
        {heroBackgroundImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroBackgroundImage}')` }}
            aria-hidden
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950" />
        )}
        <div className="absolute inset-0 bg-white/75 dark:bg-slate-950/75" aria-hidden />
        <div className="relative max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-gtek-navy dark:text-slate-200 md:text-5xl">{heroTitle}</h1>
          <Card className="mt-8 border-slate-200/90 bg-white/85 p-8 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70">
            <div className="space-y-8">
              {narrativeItems.map((item, idx) => (
                <div key={`${item.title}-${idx}`}>
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <p className="mt-3 text-slate-700 leading-relaxed dark:text-slate-300">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section className="bg-white py-14 dark:bg-slate-950">
        <div className="max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-gtek-navy dark:text-slate-200">Team</h2>
          <p className="mt-3 text-slate-600 leading-relaxed dark:text-slate-400">
            {teamIntro}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((p) => {
            const showMemberPhoto = Boolean(p.showPhoto && p.photo);
            return (
              <Card key={p.name} className={`${showMemberPhoto ? "overflow-hidden" : ""} p-6 hover:-translate-y-1 hover:shadow-md`}>
                {showMemberPhoto ? (
                  <div className="-mx-6 -mt-6 mb-6 aspect-square w-[calc(100%+3rem)] bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.photo} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <p className="text-base font-extrabold text-slate-900 leading-snug dark:text-slate-200">{p.name}</p>
                <p className="mt-1 text-sm font-semibold text-gtek-navy dark:text-slate-300">{p.title}</p>
                {p.credentials ? (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{p.credentials}</p>
                ) : null}
                <p className="mt-3 text-sm text-slate-700 leading-relaxed dark:text-slate-400">{p.bio}</p>
              </Card>
            );
          })}
        </div>

        <div className="mt-12">
          <Card className="bg-slate-50 p-6 dark:bg-slate-900">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-200">Credentials & affiliations</h3>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed dark:text-slate-400">
              {affiliations.join(" • ")}
            </p>
          </Card>
        </div>
      </Section>
    </main>
  );
}
