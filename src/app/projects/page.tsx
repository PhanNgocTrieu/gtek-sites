import Section from "@/components/ui/Section";
import ProjectsClient, { type Project } from "@/app/projects/ProjectsClient";
import { projectsQuery, siteSettingsQuery } from "@/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { isSanityConfigured } from "@/sanity/env";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore GTek Engineering’s project experience across mining, dam safety, infrastructure, industrial, commercial, hydraulic, and public projects.",
};

const mockProjects: Project[] = [
  {
    title: "Dam Safety Review (Representative)",
    sector: "Dam Safety",
    client: "Confidential hydroelectric utility",
    location: "Manitoba, Canada",
    scope:
      "GTek personnel led a dam safety review including instrumentation data review, stability re-analysis under updated loading, and recommendations for ongoing monitoring.",
    attribution: "Example shown to illustrate personnel capability; client naming subject to permission.",
  },
  {
    title: "Tailings Facility Instrumentation & Performance Review",
    sector: "Mining",
    client: "Confidential mining client",
    location: "Canada",
    scope:
      "Support for monitoring program interpretation, trend review, and practical recommendations aligned with operational constraints.",
  },
  {
    title: "Foundation Recommendations for Building / Infrastructure",
    sector: "Foundations",
    client: "Commercial owner",
    location: "Winnipeg, MB",
    scope:
      "Site investigation inputs and foundation options focusing on constructability, risk communication, and clear recommendations for design and construction.",
  },
  {
    title: "Slope Stability Assessment & Mitigation Concept",
    sector: "Slope Stability",
    client: "Infrastructure owner",
    location: "Canada",
    scope:
      "Stability screening and remediation concept development with monitoring considerations for natural and engineered slopes.",
  },
] as const;

export default async function ProjectsPage() {
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();
  const preview = cookieStore.get("sanityPreview")?.value;

  const fetchModule = await import("@/sanity/fetch");
  const settings = preview
    ? await fetchModule.sanityFetchDraft<{ projectsHeroBackground?: string }>(siteSettingsQuery, {}, 0)
    : await fetchModule.sanityFetchPublished<{ projectsHeroBackground?: string }>(siteSettingsQuery, {}, 60);
  const sanityProjects = preview
    ? await fetchModule.sanityFetchDraft<Project[]>(projectsQuery, {}, 0)
    : await fetchModule.sanityFetchPublished<Project[]>(projectsQuery, {}, 60);
  const cmsEnabled = isSanityConfigured();
  const projectsHeroBackground = settings?.projectsHeroBackground;
  return (
    <main>
      <Section className={`py-16 ${projectsHeroBackground ? "relative overflow-hidden" : "bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950"}`}>
        {projectsHeroBackground ? (
          <>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${projectsHeroBackground}')` }} aria-hidden />
            <div className="absolute inset-0 bg-white/75 dark:bg-slate-950/75" aria-hidden />
          </>
        ) : null}
        <div className={`max-w-4xl ${projectsHeroBackground ? "relative" : ""}`}>
          <h1 className="text-4xl font-extrabold tracking-tight text-gtek-navy dark:text-slate-200 md:text-5xl">Project Experience</h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed dark:text-slate-400">
            Representative examples that demonstrate capability through personnel experience—presented with clear role
            attribution where projects were delivered at previous firms.
          </p>
          <div className="mt-8">
            <Card className="bg-white p-5 shadow-sm dark:bg-slate-900">
              <p className="text-sm text-slate-700 leading-relaxed dark:text-slate-400">
                <span className="font-semibold">No-code updates:</span> Add or edit projects in the content editor and
                they appear here automatically.
              </p>
              <div className="mt-3 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/studio"
                  className="inline-flex items-center justify-center rounded-full bg-gtek-navy px-5 py-2.5 text-sm font-bold text-white hover:bg-gtek-navy/95"
                >
                  Open Content Editor
                </Link>
                <Link
                  href="/editing"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  How to add a project
                </Link>
                {!cmsEnabled ? (
                  <span className="text-xs text-slate-500 self-center">
                    Studio will show a setup screen until Sanity env is configured.
                  </span>
                ) : null}
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section className="bg-white py-14 dark:bg-slate-950">
        <ProjectsClient initialProjects={sanityProjects?.length ? sanityProjects : [...mockProjects]} />
      </Section>
    </main>
  );
}
