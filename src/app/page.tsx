import Link from "next/link";
import type { Metadata } from "next";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { WhyGtekItems } from "@/components/home/WhyGtekItems";
import { homePageQuery, siteSettingsQuery } from "@/sanity/queries";
import { loadCms } from "@/content/loadCms";
import {
  coalesceImage,
  coalesceList,
  coalesceText,
  pageSeo,
  siteConfig,
} from "@/content/siteConfig";

type SiteSettings = {
  sectors?: string[];
  themeColors?: { primary?: string; secondary?: string; accent?: string };
};

type HomePage = {
  seoTitle?: string;
  seoDescription?: string;
  heroHeadline?: string;
  heroSubhead?: string;
  heroBackground?: string;
  heroCtaLabel?: string;
  heroCtaHref?: string;
  heroSecondaryCtaLabel?: string;
  heroSecondaryCtaHref?: string;
  servicesIntro?: string;
  serviceCards?: Array<{
    title?: string;
    description?: string;
    image?: string;
    showImage?: boolean;
  }>;
  whyIntro?: string;
  whyItems?: Array<{ _key?: string; title: string; body: string }>;
  closingHeadline?: string;
  closingSubhead?: string;
  closingCtaLabel?: string;
  closingCtaHref?: string;
  pageBackgroundType?: string;
  pageBackgroundColor?: string | null;
  pageBackgroundImage?: string | null;
};

const defaults = siteConfig.homepage;

export async function generateMetadata(): Promise<Metadata> {
  const home = await loadCms<HomePage>(homePageQuery);
  return pageSeo(home, defaults.seo);
}

export default async function Home() {
  const [home, settings] = await Promise.all([
    loadCms<HomePage>(homePageQuery),
    loadCms<SiteSettings>(siteSettingsQuery),
  ]);

  const heroHeadline = coalesceText(home?.heroHeadline, defaults.heroHeadline);
  const heroSubhead = coalesceText(home?.heroSubhead, defaults.heroSubhead);
  const heroCtaLabel = coalesceText(home?.heroCtaLabel, defaults.heroCtaLabel);
  const heroCtaHref = coalesceText(home?.heroCtaHref, defaults.heroCtaHref);
  const heroSecondaryCtaLabel = coalesceText(home?.heroSecondaryCtaLabel, defaults.heroSecondaryCtaLabel);
  const heroSecondaryCtaHref = coalesceText(home?.heroSecondaryCtaHref, defaults.heroSecondaryCtaHref);
  const heroBackground = coalesceImage(home?.heroBackground, defaults.heroBackground);

  const pageBackgroundType = coalesceText(home?.pageBackgroundType, defaults.pageBackgroundType);
  const pageBackgroundColor = home?.pageBackgroundColor ?? defaults.pageBackgroundColor;
  const pageBackgroundImage = coalesceImage(home?.pageBackgroundImage, defaults.pageBackgroundImage);

  const accentColor = coalesceText(settings?.themeColors?.accent, siteConfig.settings.themeColors.accent);

  const servicesIntro = coalesceText(home?.servicesIntro, defaults.servicesIntro);
  const serviceCards = coalesceList(
    home?.serviceCards
      ?.filter((card): card is { title: string; description: string; image?: string; showImage?: boolean } =>
        Boolean(card?.title && card?.description),
      )
      .map((card) => ({
        title: card.title,
        description: card.description,
        image: coalesceImage(card.image),
        showImage: Boolean(card.showImage),
      })),
    defaults.serviceCards,
  );

  const whyIntro = coalesceText(home?.whyIntro, defaults.whyIntro);
  const whyItems = coalesceList(home?.whyItems, defaults.whyItems);

  const sectors = coalesceList(settings?.sectors, siteConfig.settings.sectors);

  const closingHeadline = coalesceText(home?.closingHeadline, defaults.closingHeadline);
  const closingSubhead = coalesceText(home?.closingSubhead, defaults.closingSubhead);
  const closingCtaLabel = coalesceText(home?.closingCtaLabel, defaults.closingCtaLabel);
  const closingCtaHref = coalesceText(home?.closingCtaHref, defaults.closingCtaHref);

  return (
    <main>
      <section
        className="relative overflow-hidden text-white"
        style={
          pageBackgroundType === "color"
            ? { backgroundColor: pageBackgroundColor ?? undefined }
            : pageBackgroundType === "image"
            ? { backgroundImage: `url(${pageBackgroundImage || heroBackground})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      >
        {pageBackgroundType === "none" ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: heroBackground ? `url(${heroBackground})` : undefined,
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/65 to-gtek-navy/90" />
        <div className="relative">
          <Section className="py-20 md:py-28">
            <div className="max-w-4xl">
              <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {heroHeadline}
              </h1>
              <p className="mt-6 text-lg md:text-2xl text-slate-200 leading-relaxed max-w-3xl">
                {heroSubhead}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href={heroCtaHref} className="inline-flex items-center justify-center rounded-md px-8 py-4 text-lg font-extrabold text-gtek-navy hover:opacity-95 transition-all" style={{ backgroundColor: accentColor }}>
                  {heroCtaLabel}
                </Link>
                <Link
                  href={heroSecondaryCtaHref}
                  className="inline-flex items-center justify-center rounded-md border-2 border-white/40 px-8 py-4 text-lg font-bold text-white hover:border-white transition-colors"
                >
                  {heroSecondaryCtaLabel}
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
          {serviceCards.slice(0, 4).map((s) => {
            const showCardImage = s.showImage && s.image;
            return (
              <Card key={s.title} className="overflow-hidden hover:-translate-y-1 hover:shadow-lg">
                {showCardImage ? (
                  <div className="aspect-[16/9] w-full bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt="" className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <div className={`${showCardImage ? "p-6" : "p-6"} flex items-start gap-4`}>
                  {!showCardImage ? (
                    <div className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gtek-navy text-white">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l5-8 5 8" />
                      </svg>
                    </div>
                  ) : null}
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-200">{s.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed dark:text-slate-400">{s.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section className="bg-slate-50 py-14 dark:bg-slate-900">
        <div className="max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-gtek-navy dark:text-slate-200">Why GTek</h2>
          {whyIntro ? (
            <p className="mt-3 text-slate-600 leading-relaxed dark:text-slate-400">
              {whyIntro}
            </p>
          ) : null}
        </div>
        <WhyGtekItems items={whyItems} />
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
            href={closingCtaHref}
            className="inline-flex items-center justify-center rounded-md bg-gtek-amber px-8 py-4 text-base font-extrabold text-gtek-navy hover:bg-yellow-400 transition-colors"
          >
            {closingCtaLabel}
          </Link>
        </div>
      </Section>
    </main>
  );
}
