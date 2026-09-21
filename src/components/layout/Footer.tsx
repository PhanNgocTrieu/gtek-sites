import Image from "next/image";
import { siteSettingsQuery } from "@/sanity/queries";
import { sanityFetchPublished } from "@/sanity/fetch";
import { coalesceImage, coalesceList, coalesceText, siteConfig } from "@/content/siteConfig";

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

const defaults = siteConfig.settings;

export default async function Footer() {
  const settings = await sanityFetchPublished<FooterSettings>(siteSettingsQuery, {}, 120);

  const companyName = coalesceText(settings?.companyName, defaults.companyName);
  const tagline = coalesceText(settings?.footerTagline, defaults.footer.footerTagline);
  const phone = coalesceText(settings?.phone, defaults.phone);
  const email = coalesceText(settings?.footerEmail, coalesceText(settings?.generalEmail, defaults.footer.footerEmail));
  const licenses = coalesceList(settings?.footerLicenses, defaults.footer.footerLicenses);
  const copyright = coalesceText(
    settings?.footerCopyright,
    defaults.footer.footerCopyright || `© ${new Date().getFullYear()} ${companyName} All rights reserved.`,
  );
  const logoSrc = coalesceImage(settings?.footerLogo, defaults.footer.footerLogo);
  const remoteLogo = /^https?:\/\//i.test(logoSrc);

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-14 text-slate-600 transition-colors dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 md:grid-cols-3">
        <div>
          {remoteLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt={companyName}
              className="mb-5 h-11 w-auto max-w-[min(100%,260px)] object-contain"
            />
          ) : (
            <Image
              src={logoSrc || "/images/gtek-logo.png"}
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
