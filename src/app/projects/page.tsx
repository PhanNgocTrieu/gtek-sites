import Section from "@/components/ui/Section";
import ProjectsClient, { type Project } from "@/app/projects/ProjectsClient";
import SanityStudioFab from "@/components/layout/SanityStudioFab";
import { projectsPageQuery, projectsQuery, siteSettingsQuery } from "@/sanity/queries";
import type { Metadata } from "next";
import { loadCms } from "@/content/loadCms";
import {
  coalesceImage,
  coalesceList,
  coalesceText,
  pageSeo,
  siteConfig,
} from "@/content/siteConfig";

type ProjectsPageDoc = {
  seoTitle?: string;
  seoDescription?: string;
  heroTitle?: string;
  heroSubhead?: string;
  heroBackground?: string;
  displayMode?: "withImage" | "withoutImage";
  filterCategories?: string[];
};

const defaults = siteConfig.projects;

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadCms<ProjectsPageDoc>(projectsPageQuery);
  return pageSeo(page, defaults.seo);
}

export default async function ProjectsPage() {
  const [page, settings, sanityProjects] = await Promise.all([
    loadCms<ProjectsPageDoc>(projectsPageQuery),
    loadCms<{
      projectsHeroBackground?: string;
      projectsDisplayMode?: "withImage" | "withoutImage";
    }>(siteSettingsQuery),
    loadCms<Project[]>(projectsQuery),
  ]);

  const heroTitle = coalesceText(page?.heroTitle, defaults.heroTitle);
  const heroSubhead = coalesceText(page?.heroSubhead, defaults.heroSubhead);
  const projectsHeroBackground = coalesceImage(
    page?.heroBackground,
    coalesceImage(settings?.projectsHeroBackground, siteConfig.settings.backgrounds.projectsHeroBackground),
  );
  const displayModeValue = page?.displayMode || settings?.projectsDisplayMode || siteConfig.settings.projectsDisplayMode;
  const projectsDisplayMode = displayModeValue === "withoutImage" ? "withoutImage" : "withImage";
  const filterCategories = coalesceList(page?.filterCategories, defaults.filterCategories);
  const projects = coalesceList(
    sanityProjects,
    defaults.items.map((item) => ({
      title: item.title,
      sector: item.sector as Project["sector"],
      client: item.client,
      location: item.location,
      scope: item.scope,
      attribution: item.attribution || undefined,
      image: item.image || undefined,
    })),
  );

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
          <h1 className="text-4xl font-extrabold tracking-tight text-gtek-navy dark:text-slate-200 md:text-5xl">{heroTitle}</h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed dark:text-slate-400">
            {heroSubhead}
          </p>
        </div>
      </Section>

      <Section className="bg-white py-14 dark:bg-slate-950">
        <ProjectsClient
          initialProjects={projects}
          displayMode={projectsDisplayMode}
          filterCategories={filterCategories}
        />
      </Section>

      <SanityStudioFab />
    </main>
  );
}
