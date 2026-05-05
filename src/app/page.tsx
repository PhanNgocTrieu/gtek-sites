import Link from "next/link";
import type { Metadata } from "next";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { homePageQuery, siteSettingsQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Geotechnical Engineering",
  description:
    "Geotechnical engineering grounded in experience. Winnipeg-based consultancy serving dam safety, mining, foundations, and slope stability across Canada.",
};

type SiteSettings = {
  companyName?: string;
  sectors?: string[];
  themeColors?: { primary?: string; secondary?: string; accent?: string };
  contactEmail?: string;
};

type HomePage = {
  heroHeadline?: string;
  heroSubhead?: string;
  heroBackground?: string;
  heroCtaLabel?: string;
  servicesIntro?: string;
  serviceCards?: Array<{ title: string; description: string }>;
  whyIntro?: string;
  whyItems?: Array<{ title: string; body: string }>;
  closingHeadline?: string;
  closingSubhead?: string;
  closingCtaLabel?: string;
  pageBackgroundType?: string;
  pageBackgroundColor?: string | null;
  pageBackgroundImage?: string | null;
};

export default async function Home() {
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();
  const preview = cookieStore.get("sanityPreview")?.value;

  const fetchModule = await import("@/sanity/fetch");

  const [home, settings] = await Promise.all([
    preview
      ? fetchModule.sanityFetchDraft<HomePage>(homePageQuery, {}, 0)
      : fetchModule.sanityFetchPublished<HomePage>(homePageQuery, {}, 60),
    preview
      ? fetchModule.sanityFetchDraft<SiteSettings>(siteSettingsQuery, {}, 0)
      : fetchModule.sanityFetchPublished<SiteSettings>(siteSettingsQuery, {}, 60),
  ]);

  const heroHeadline = home?.heroHeadline ?? "Geotechnical engineering grounded in experience.";
  const heroSubhead =
    home?.heroSubhead ??
    "GTek Engineering is a Winnipeg-based geotechnical consultancy serving the dam safety, mining, foundation, and slope stability sectors across Canada.";
  const heroCtaLabel = home?.heroCtaLabel ?? "Talk to our team";
  const heroBackground =
    home?.heroBackground ??
    "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=2200&q=80";

  const pageBackgroundType = home?.pageBackgroundType ?? "none";
  const pageBackgroundColor = home?.pageBackgroundColor ?? null;
  const pageBackgroundImage = home?.pageBackgroundImage ?? null;

  const accentColor = settings?.themeColors?.accent ?? "#FFB400";

  const servicesIntro =
    home?.servicesIntro ?? "Clear scope, senior-led delivery, and practical recommendations you can build with.";
  const serviceCards =
    home?.serviceCards?.length
      ? home.serviceCards
      : [
          {
            title: "Dam Safety",
            description:
              "Inspection, instrumentation, and risk assessment for new and existing dams aligned with CDA guidelines.",
          },
          {
            title: "Mining",
            description:
              "Geotechnical support for tailings facilities, open-pit slope design, and mine waste management.",
          },
          {
            title: "Foundations",
            description:
              "Site investigation, foundation design, and construction-phase geotechnical engineering for buildings and infrastructure.",
          },
          {
            title: "Slope Stability",
            description:
              "Stability analysis, remediation design, and monitoring for natural and engineered slopes.",
          },
        ];

  const whyIntro =
    home?.whyIntro ?? "Built for projects where speed, accountability, and technical depth matter.";
  const whyItems =
    home?.whyItems?.length
      ? home.whyItems
      : [
          {
            title: "Senior-led delivery.",
            body: "Every project is led by a Principal Engineer with 25+ years of experience—no handoff after the proposal stage.",
          },
          {
            title: "Direct access, fast response.",
            body: "A small firm without layers. Clients work with decision-makers from day one and get answers quickly.",
          },
          {
            title: "Specialized technical depth.",
            body: "Focused expertise in dam engineering, mining geotechnics, and technical review on the projects we choose to take on.",
          },
        ];

  const sectors =
    settings?.sectors?.length
      ? settings.sectors
      : ["Mining", "Hydroelectric & Dams", "Transportation", "Buildings & Foundations", "Industrial"];

  const closingHeadline = home?.closingHeadline ?? "Have a project? Let’s talk.";
  const closingSubhead = home?.closingSubhead ?? "GTek welcomes inquiries on geotechnical projects of any scale across Canada.";
  const closingCtaLabel = home?.closingCtaLabel ?? "Contact GTek";

  return (
    <main>
      <section
        className="relative overflow-hidden text-white"
        style={
          pageBackgroundType === "color"
            ? { backgroundColor: pageBackgroundColor ?? undefined }
            : pageBackgroundType === "image"
            ? { backgroundImage: `url(${pageBackgroundImage ?? heroBackground})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      >
        {pageBackgroundType === "none" ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroBackground})`,
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/65 to-gtek-navy/90" />
        <div className="relative">
          <Section className="py-20 md:py-28">
            <div className="max-w-4xl">
              <Badge>Winnipeg • Canada-wide support</Badge>
              <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {heroHeadline}
              </h1>
              <p className="mt-6 text-lg md:text-2xl text-slate-200 leading-relaxed max-w-3xl">
                {heroSubhead}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="inline-flex items-center justify-center rounded-md px-8 py-4 text-lg font-extrabold text-gtek-navy hover:opacity-95 transition-all" style={{ backgroundColor: accentColor }}>
                  {heroCtaLabel}
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-md border-2 border-white/40 px-8 py-4 text-lg font-bold text-white hover:border-white transition-colors"
                >
                  View services
                </Link>
              </div>
            </div>
          </Section>
        </div>
      </section>

      <Section className="bg-white py-14 dark:bg-slate-950">
        <div className="max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-gtek-navy dark:text-slate-200">Services</h2>
          <p className="mt-3 text-slate-600 leading-relaxed dark:text-slate-400">
            {servicesIntro}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCards.slice(0, 4).map((s) => (
            <Card key={s.title} className="p-6 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gtek-navy text-white">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l5-8 5 8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-200">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed dark:text-slate-400">{s.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-slate-50 py-14 dark:bg-slate-900">
        <div className="max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-gtek-navy dark:text-slate-200">Why GTek</h2>
          <p className="mt-3 text-slate-600 leading-relaxed dark:text-slate-400">
            {whyIntro}
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyItems.slice(0, 3).map((v) => (
            <Card key={v.title} className="p-6 hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-200">{v.title}</h3>
              <p className="mt-3 text-sm text-slate-700 leading-relaxed dark:text-slate-400">{v.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-white py-8 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
          <span className="text-slate-400">Sectors served:</span>
          {sectors.map((s, idx) => (
            <span key={s} className="inline-flex items-center gap-3">
              <span>{s}</span>
              {idx < sectors.length - 1 ? <span className="text-slate-300">•</span> : null}
            </span>
          ))}
        </div>
      </Section>

      <Section className="bg-gtek-navy py-14">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-200">{closingHeadline}</h2>
            <p className="mt-3 text-slate-300 leading-relaxed">
              {closingSubhead}
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md bg-gtek-amber px-8 py-4 text-base font-extrabold text-gtek-navy hover:bg-yellow-400 transition-colors"
          >
            {closingCtaLabel}
          </Link>
        </div>
      </Section>
    </main>
  );
}
