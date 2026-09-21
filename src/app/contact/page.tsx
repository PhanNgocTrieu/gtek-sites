import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import ContactForm, { type ContactFormCopy } from "@/app/contact/ContactForm";
import type { Metadata } from "next";
import { contactPageQuery, siteSettingsQuery } from "@/sanity/queries";
import { loadCms } from "@/content/loadCms";
import {
  coalesceImage,
  coalesceList,
  coalesceText,
  pageSeo,
  resolveImageSrc,
  siteConfig,
} from "@/content/siteConfig";

type SiteSettings = {
  companyName?: string;
  tagline?: string;
  generalEmail?: string;
  phone?: string;
  websiteUrl?: string;
  addressLines?: string[];
  officeHours?: string;
  contactResponsibleName?: string;
  contactCertificate?: string;
  contactPosition?: string;
  contactLogo?: string;
  contactQrImage?: string;
  contactHeroBackground?: string;
};

type FormField = {
  label?: string;
  required?: boolean;
  placeholder?: string;
};

type ContactPageDoc = {
  seoTitle?: string;
  seoDescription?: string;
  badge?: string;
  heroTitle?: string;
  heroSubhead?: string;
  heroBackground?: string;
  formTitle?: string;
  formIntro?: string;
  formSubjects?: string[];
  formFields?: {
    name?: FormField;
    company?: FormField;
    email?: FormField;
    subject?: FormField;
    message?: FormField;
  };
  submitLabel?: string;
  successMessage?: string;
  detailsTitle?: string;
  companyName?: string;
  tagline?: string;
  contactResponsibleName?: string;
  contactCertificate?: string;
  contactPosition?: string;
  phone?: string;
  displayEmail?: string;
  websiteUrl?: string;
  addressLines?: string[];
  officeHours?: string;
  contactLogo?: string;
  contactQrImage?: string;
  mapTitle?: string;
  mapIntro?: string;
  mapEmbedUrl?: string;
};

const pageDefaults = siteConfig.contact;
const settingDefaults = siteConfig.settings;

function mergeField(field: FormField | undefined, fallback: ContactFormCopy["fields"]["name"]) {
  return {
    label: coalesceText(field?.label, fallback.label),
    required: typeof field?.required === "boolean" ? field.required : fallback.required,
    placeholder: coalesceText(field?.placeholder, fallback.placeholder),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadCms<ContactPageDoc>(contactPageQuery);
  return pageSeo(page, pageDefaults.seo);
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([
    loadCms<ContactPageDoc>(contactPageQuery),
    loadCms<SiteSettings>(siteSettingsQuery),
  ]);

  const badge = coalesceText(page?.badge, pageDefaults.badge);
  const heroTitle = coalesceText(page?.heroTitle, pageDefaults.heroTitle);
  const heroSubhead = coalesceText(page?.heroSubhead, pageDefaults.heroSubhead);
  const contactHeroBackground = coalesceImage(page?.heroBackground, settings?.contactHeroBackground);
  const formTitle = coalesceText(page?.formTitle, pageDefaults.formTitle);
  const formIntro = coalesceText(page?.formIntro, pageDefaults.formIntro);
  const formCopy: ContactFormCopy = {
    subjects: coalesceList(page?.formSubjects, pageDefaults.formSubjects),
    fields: {
      name: mergeField(page?.formFields?.name, pageDefaults.formFields.name),
      company: mergeField(page?.formFields?.company, pageDefaults.formFields.company),
      email: mergeField(page?.formFields?.email, pageDefaults.formFields.email),
      subject: mergeField(page?.formFields?.subject, pageDefaults.formFields.subject),
      message: mergeField(page?.formFields?.message, pageDefaults.formFields.message),
    },
    submitLabel: coalesceText(page?.submitLabel, pageDefaults.submitLabel),
    successMessage: coalesceText(page?.successMessage, pageDefaults.successMessage),
  };

  const detailsTitle = coalesceText(page?.detailsTitle, pageDefaults.detailsTitle);
  const companyName = coalesceText(page?.companyName, coalesceText(settings?.companyName, settingDefaults.companyName));
  const tagline = coalesceText(page?.tagline, coalesceText(settings?.tagline, settingDefaults.tagline));
  const contactResponsibleName = coalesceText(
    page?.contactResponsibleName,
    coalesceText(settings?.contactResponsibleName, settingDefaults.contact.contactResponsibleName),
  );
  const contactCertificate = coalesceText(
    page?.contactCertificate,
    coalesceText(settings?.contactCertificate, settingDefaults.contact.contactCertificate),
  );
  const contactPosition = coalesceText(
    page?.contactPosition,
    coalesceText(settings?.contactPosition, settingDefaults.contact.contactPosition),
  );
  const phone = coalesceText(page?.phone, coalesceText(settings?.phone, settingDefaults.phone));
  const generalEmail = coalesceText(
    page?.displayEmail,
    coalesceText(settings?.generalEmail, settingDefaults.generalEmail),
  );
  const websiteUrl = coalesceText(page?.websiteUrl, coalesceText(settings?.websiteUrl, settingDefaults.websiteUrl));
  const websiteLabel = websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const addressLines = coalesceList(page?.addressLines, coalesceList(settings?.addressLines, settingDefaults.addressLines));
  const officeHours = coalesceText(page?.officeHours, coalesceText(settings?.officeHours, settingDefaults.officeHours));
  const contactLogo = resolveImageSrc(
    coalesceImage(page?.contactLogo, settings?.contactLogo),
    settingDefaults.contact.contactLogo,
  );
  const contactQrImage = resolveImageSrc(
    coalesceImage(page?.contactQrImage, settings?.contactQrImage),
    settingDefaults.contact.contactQrImage,
  );
  const mapTitle = coalesceText(page?.mapTitle, pageDefaults.mapTitle);
  const mapIntro = coalesceText(page?.mapIntro, pageDefaults.mapIntro);
  const mapEmbedUrl = coalesceText(page?.mapEmbedUrl, pageDefaults.mapEmbedUrl);

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <Card className="p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-200">{formTitle}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{formIntro}</p>
              <div className="mt-6">
                <ContactForm copy={formCopy} />
              </div>
            </Card>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <Card className="overflow-hidden p-0 hover:shadow-md">
              <h2 className="px-6 pt-6 text-xl font-bold text-slate-900 dark:text-slate-200">{detailsTitle}</h2>
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
                      {addressLines.length ? (
                        <div className="flex items-start gap-3">
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-300/70 text-emerald-300">
                            ⌖
                          </span>
                          <p>{addressLines.join(", ")}</p>
                        </div>
                      ) : null}
                      {officeHours ? (
                        <p className="pt-1 text-sm text-slate-200">{officeHours}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <Image
                      src={contactLogo}
                      alt={`${companyName} logo`}
                      width={176}
                      height={80}
                      className="h-auto w-44 object-contain"
                    />
                    <Image
                      src={contactQrImage}
                      alt={`QR code to ${companyName} website`}
                      width={128}
                      height={128}
                      className="h-32 w-32 bg-white p-1"
                    />
                  </div>
                </div>

                <p className="mt-6 text-xl italic tracking-wide text-emerald-300">{tagline}</p>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-md">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-200">{mapTitle}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{mapIntro}</p>
              </div>
              <div className="aspect-[16/10] w-full bg-slate-100">
                <iframe
                  title={`${companyName} - Winnipeg`}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapEmbedUrl}
                />
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </main>
  );
}
