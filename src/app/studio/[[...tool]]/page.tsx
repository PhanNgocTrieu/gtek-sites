import { isSanityConfigured } from "@/sanity/env";
import Section from "@/components/ui/Section";
import Studio from "@/app/studio/Studio";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  if (!isSanityConfigured()) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-slate-50">
        <Section className="py-14">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-gtek-navy">Sanity Studio is not configured</h1>
            <p className="mt-4 text-slate-700 leading-relaxed">
              To enable the CMS, set these environment variables and restart the dev server:
            </p>
            <ul className="mt-4 list-disc pl-6 text-sm text-slate-700 space-y-1">
              <li>
                <code className="font-semibold">NEXT_PUBLIC_SANITY_PROJECT_ID</code>
              </li>
              <li>
                <code className="font-semibold">NEXT_PUBLIC_SANITY_DATASET</code>
              </li>
              <li>
                <code className="font-semibold">NEXT_PUBLIC_SANITY_API_VERSION</code> (optional)
              </li>
            </ul>
            <p className="mt-6 text-sm text-slate-600">
              Once configured, this route will host the studio so Wayne can edit content without touching code.
            </p>
          </div>
        </Section>
      </main>
    );
  }

  return <Studio />;
}

