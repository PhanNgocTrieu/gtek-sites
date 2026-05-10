import Section from "@/components/ui/Section";
import ProjectsClient, { type Project } from "@/app/projects/ProjectsClient";
import SanityStudioFab from "@/components/layout/SanityStudioFab";
import { projectsQuery, siteSettingsQuery } from "@/sanity/queries";
import type { Metadata } from "next";

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
        </div>
      </Section>

      <Section className="bg-white py-14 dark:bg-slate-950">
        <ProjectsClient initialProjects={sanityProjects?.length ? sanityProjects : [...mockProjects]} />
      </Section>

      <SanityStudioFab />
    </main>
  );
}
