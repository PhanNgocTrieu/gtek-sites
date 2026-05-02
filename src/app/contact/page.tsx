import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import ContactForm from "@/app/contact/ContactForm";
import type { Metadata } from "next";
import { sanityFetch } from "@/sanity/fetch";
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
  officeHours?: string;
  addressLines?: string[];
};

export default async function ContactPage() {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery, {}, 300);
  const companyName = settings?.companyName ?? "GTek Engineering Inc.";
  const generalEmail = settings?.generalEmail ?? "info@gtek.ca";
  const phone = settings?.phone ?? "[office phone]";
  const officeHours = settings?.officeHours ?? "Monday – Friday, 8:00 AM – 5:00 PM CT";
  const addressLines =
    settings?.addressLines?.length ? settings.addressLines : ["[Office street address]", "Winnipeg, Manitoba [postal code]"];

  return (
    <main>
      <Section className="py-14 bg-slate-50">
        <div className="max-w-4xl">
          <Badge>Contact</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-gtek-navy">
            Let’s talk about your project
          </h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed">
            Contact details, map, and a simple form—everything you need on one page.
          </p>
        </div>
      </Section>

      <Section className="py-14 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900">Contact form</h2>
              <p className="mt-2 text-sm text-slate-600">A short form to help us triage your inquiry.</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </Card>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900">Contact details</h2>
              <div className="mt-4 text-sm text-slate-700 leading-relaxed space-y-3">
                <div>
                  <p className="font-semibold">{companyName}</p>
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Phone:</span> {phone}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    <a className="font-semibold text-gtek-navy hover:underline" href={`mailto:${generalEmail}`}>
                      {generalEmail}
                    </a>
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Office hours:</span> {officeHours}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">Map</h2>
                <p className="mt-2 text-sm text-slate-600">Google Maps embed showing the Winnipeg office location.</p>
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
