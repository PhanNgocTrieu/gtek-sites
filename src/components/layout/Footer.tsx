import Image from "next/image";
import { siteSettingsQuery } from "@/sanity/queries";
import { sanityFetchPublished } from "@/sanity/fetch";

type FooterSettings = {
  companyName?: string;
  generalEmail?: string;
  phone?: string;
  footerTagline?: string;
  footerLogo?: string;
  footerEmail?: string;
  footerLicenses?: string[];
  footerCopyright?: string;
};

const defaultTagline =
  "Senior-led geotechnical consulting for dam safety, mining, foundations, and slope stability projects across Canada.";

const defaultLicenses = ["M.Eng., P.Eng.", "Licensed in MB, SK, BC", "Canadian Geotechnical Society", "Canadian Dam Association"];

export default async function Footer() {
  const settings = await sanityFetchPublished<FooterSettings>(siteSettingsQuery, {}, 120);

  const companyName = settings?.companyName ?? "GTek Engineering Inc.";
  const tagline = settings?.footerTagline ?? defaultTagline;
  const phone = settings?.phone ?? "+1 204 792 8829";
  const email = settings?.footerEmail ?? settings?.generalEmail ?? "wayne.wong@gtekeng.com";
  const licenses = settings?.footerLicenses?.length ? settings.footerLicenses : defaultLicenses;
  const copyright =
    settings?.footerCopyright ?? `© ${new Date().getFullYear()} ${companyName} All rights reserved.`;
  const logoSrc = settings?.footerLogo ?? "/images/gtek-logo.png";

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-14 text-slate-600 transition-colors dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 md:grid-cols-3">
        <div>
          {settings?.footerLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt={companyName}
              className="mb-5 h-11 w-auto max-w-[min(100%,260px)] object-contain"
            />
          ) : (
            <Image
              src="/images/gtek-logo.png"
              alt={companyName}
              width={238}
              height={120}
              className="mb-5 h-11 w-auto max-w-[min(100%,260px)]"
            />
          )}
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{tagline}</p>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-bold text-gtek-navy dark:text-slate-200">Contact Info</h3>
          <address className="not-italic space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {phone ? <p>Phone {phone}</p> : null}
            {email ? (
              <p className="pt-2">
                Email:{" "}
                <a
                  href={`mailto:${email}`}
                  className="font-medium text-gtek-navy underline-offset-2 transition-colors hover:text-gtek-amber hover:underline active:text-yellow-600 dark:text-slate-300 dark:hover:text-gtek-amber dark:active:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gtek-amber"
                >
                  {email}
                </a>
              </p>
            ) : null}
          </address>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-bold text-gtek-navy dark:text-slate-200">Licenses & Affiliations</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            {licenses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-10 border-t border-slate-200 px-4 pt-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <p>{copyright.startsWith("©") ? copyright : `© ${copyright}`}</p>
      </div>
    </footer>
  );
}
