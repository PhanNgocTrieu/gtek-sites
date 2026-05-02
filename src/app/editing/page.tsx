import type { Metadata } from "next";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Editing Guide",
  description:
    "A simple guide for non-technical users to update GTek’s website content using Sanity Studio — no code required.",
};

export default function EditingGuidePage() {
  return (
    <main>
      <Section className="py-14 bg-slate-50">
        <div className="max-w-4xl">
          <Badge>Non-technical editing</Badge>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-gtek-navy">
            Update the website without touching code
          </h1>
          <p className="mt-5 text-lg text-slate-600 leading-relaxed">
            GTek’s website is connected to a CMS called Sanity. Wayne (or any authorized user) can add projects,
            update services, and adjust copy in a browser — like filling out a form.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/studio"
              className="inline-flex items-center justify-center rounded-md bg-gtek-navy px-6 py-3 text-base font-bold text-white hover:bg-gtek-navy/95"
            >
              Open Content Editor
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-900 hover:bg-slate-50"
            >
              View Projects page
            </Link>
          </div>
        </div>
      </Section>

      <Section className="py-14 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900">1) Add a project (no code)</h2>
              <ol className="mt-4 space-y-3 text-sm text-slate-700 list-decimal pl-5">
                <li>
                  Go to <span className="font-semibold">Content Editor</span> at{" "}
                  <Link href="/studio" className="font-semibold text-gtek-navy hover:underline">
                    /studio
                  </Link>
                  .
                </li>
                <li>Click <span className="font-semibold">Projects</span>.</li>
                <li>Click <span className="font-semibold">Create new</span>.</li>
                <li>
                  Fill out: <span className="font-semibold">Project Name</span>, <span className="font-semibold">Sector</span>,
                  <span className="font-semibold"> Client</span>, <span className="font-semibold">Location</span>, and{" "}
                  <span className="font-semibold">Scope summary</span> (1–2 sentences). Add a <span className="font-semibold">Project image</span> if available.
                </li>
                <li>Click <span className="font-semibold">Publish</span>.</li>
                <li>
                  Refresh{" "}
                  <Link href="/projects" className="font-semibold text-gtek-navy hover:underline">
                    Projects
                  </Link>{" "}
                  — the new card appears automatically.
                </li>
              </ol>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900">2) Update services</h2>
              <ol className="mt-4 space-y-3 text-sm text-slate-700 list-decimal pl-5">
                <li>Open <Link href="/studio" className="font-semibold text-gtek-navy hover:underline">/studio</Link>.</li>
                <li>Click <span className="font-semibold">Service Groups</span>.</li>
                <li>Edit the list items and publish.</li>
              </ol>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900">3) Update Home / About / Contact details</h2>
              <ol className="mt-4 space-y-3 text-sm text-slate-700 list-decimal pl-5">
                <li>
                  In Studio, use the top menu items: <span className="font-semibold">Home Page</span>,{" "}
                  <span className="font-semibold">About Page</span>, and <span className="font-semibold">Site Settings</span>.
                </li>
                <li>
                  Update text fields (headline, value props, team bios, address/email/phone) and click{" "}
                  <span className="font-semibold">Publish</span>.
                </li>
                <li>Refresh the website to see changes.</li>
              </ol>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900">Non-tech friendly by design</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>
                  <span className="font-semibold">No terminal, no Git, no code</span> — editing happens in the browser.
                </li>
                <li>
                  <span className="font-semibold">Safe fields</span> — titles/categories are structured so formatting stays consistent.
                </li>
                <li>
                  <span className="font-semibold">Immediate results</span> — publish in Studio, then refresh the website.
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-900">Need access?</h2>
              <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                Sanity Studio requires login. Once set up, Wayne can invite other editors and control who can publish.
              </p>
            </Card>
          </div>
        </div>
      </Section>
    </main>
  );
}

