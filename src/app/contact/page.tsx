import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import ContactForm from "@/app/contact/ContactForm";
import type { Metadata } from "next";
import { siteSettingsQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact GTek Engineering Inc. in Winnipeg, Manitoba for geotechnical consulting, dam safety support, and materials testing. Send an inquiry via our contact form.",
};

type SiteSettings = {
  companyName?: string;
  generalEmail?: string;
  phone?: string;
  addressLines?: string[];
  contactResponsibleName?: string;
  contactCertificate?: string;
  contactPosition?: string;
  websiteUrl?: string;
  contactLogo?: string;
  contactQrImage?: string;
  contactHeroBackground?: string;
};

function toNextImageSrc(src: string | undefined, fallback: string) {
  const raw = (src ?? "").trim() || fallback;
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }
  const withoutPublic = raw.replace(/^\/?public\//, "/");
  return withoutPublic.startsWith("/") ? withoutPublic : `/${withoutPublic}`;
}

export default async function ContactPage() {
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();
  const preview = cookieStore.get("sanityPreview")?.value;

  const fetchModule = await import("@/sanity/fetch");
  const settings = preview
    ? await fetchModule.sanityFetchDraft<SiteSettings>(siteSettingsQuery, {}, 0)
    : await fetchModule.sanityFetchPublished<SiteSettings>(siteSettingsQuery, {}, 60);
  const companyName = settings?.companyName ?? "GTek Engineering";
  const generalEmail = settings?.generalEmail ?? "wayne.wong@gtekeng.com";
  const phone = settings?.phone ?? "+1 (204) 792-8829";
  const contactResponsibleName = settings?.contactResponsibleName ?? "Wayne (WK) Wong";
  const contactCertificate = settings?.contactCertificate ?? "M.Eng., P.Eng.";
  const contactPosition = settings?.contactPosition ?? "Principal Geotechnical Engineer, President";
  const websiteUrl = settings?.websiteUrl ?? "https://www.gtekeng.com";
  const websiteLabel = websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const contactLogo = toNextImageSrc(settings?.contactLogo, "/images/gtek-logo.png");
  const contactQrImage = toNextImageSrc(settings?.contactQrImage, "/images/contact/qr.jpg");;
  const contactHeroBackground = settings?.contactHeroBackground;

  return (
    <main>
      <Section className={`py-16 ${contactHeroBackground ? "relative overflow-hidden" : "bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950"}`}>
        {contactHeroBackground ? (
          <>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${contactHeroBackground}')` }} aria-hidden />
            <div className="absolute inset-0 bg-white/75 dark:bg-slate-950/75" aria-hidden />
          </>
        ) : null}
        <div className={`max-w-4xl ${contactHeroBackground ? "relative" : ""}`}>
          <Badge>Contact</Badge>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gtek-navy dark:text-slate-200 md:text-5xl">
            Let’s talk about your project
          </h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed dark:text-slate-400">
            Contact details, map, and a simple form—everything you need on one page.
          </p>
        </div>
      </Section>

      <Section className="bg-white py-14 dark:bg-slate-950">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <Card className="p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-200">Contact form</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">A short form to help us triage your inquiry.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </Card>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <Card className="overflow-hidden p-0 hover:shadow-md">
              <h2 className="px-6 pt-6 text-xl font-bold text-slate-900 dark:text-slate-200">Contact details</h2>
              <div className="mt-4 bg-[#0F4A57] p-6 text-slate-100">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-2xl font-bold tracking-wide">{companyName}</p>
                    <p className="mt-2 text-xl font-semibold text-slate-100">{contactResponsibleName}</p>
                    <p className="mt-1 text-base text-slate-200">{contactCertificate}</p>
                    <p className="mt-1 text-base text-slate-200">{contactPosition}</p>

                    <div className="mt-6 space-y-3 text-base">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300/70 text-emerald-300">
                          ☎
                        </span>
                        <a className="hover:underline" href={`tel:${phone.replace(/\s+/g, "")}`}>
                          {phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300/70 text-emerald-300">
                          ✉
                        </span>
                        <a className="break-all hover:underline" href={`mailto:${generalEmail}`}>
                          {generalEmail}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-300/70 text-emerald-300">
                          🌐
                        </span>
                        <a className="hover:underline" href={websiteUrl} target="_blank" rel="noreferrer">
                          {websiteLabel}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <Image
                      src={contactLogo}
                      alt="GTek Engineering logo"
                      width={176}
                      height={80}
                      className="h-auto w-44 object-contain"
                    />
                    <Image
                      src={contactQrImage}
                      alt="QR code to GTek Engineering website"
                      width={128}
                      height={128}
                      className="h-32 w-32 bg-white p-1"
                    />
                  </div>
                </div>

                <p className="mt-6 text-xl italic tracking-wide text-emerald-300">Engineered Ground Solutions</p>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-md">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-200">Map</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Google Maps embed showing the Winnipeg office location.</p>
              </div>
              <div className="aspect-[16/10] w-full bg-slate-100">
                <iframe
                  title="GTek Engineering - Winnipeg"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=Winnipeg%2C%20MB&output=embed"
                />
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </main>
  );
}
