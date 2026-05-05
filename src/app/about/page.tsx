import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import type { Metadata } from "next";
import { aboutPageQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the team behind GTek Engineering Inc. A Winnipeg-based geotechnical consulting firm focused on dam safety, mining, foundations, and slope stability across Canada.",
};

type AboutPageDoc = {
  narrative?: string[];
  teamMembers?: Array<{
    name: string;
    title: string;
    credentials?: string;
    bio: string;
    photo?: string;
  }>;
  affiliations?: string[];
};

export default async function AboutPage() {
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();
  const preview = cookieStore.get("sanityPreview")?.value;

  const fetchModule = await import("@/sanity/fetch");
  const about = preview
    ? await fetchModule.sanityFetchDraft<AboutPageDoc>(aboutPageQuery, {}, 0)
    : await fetchModule.sanityFetchPublished<AboutPageDoc>(aboutPageQuery, {}, 120);
  const narrative =
    about?.narrative?.length
      ? about.narrative
      : [
          "GTek Engineering Inc. is a geotechnical consulting firm founded in Winnipeg, Manitoba. We provide engineering services across dam safety, mining, foundations, and slope stability, drawing on more than 25 years of combined senior experience.",
          "We are deliberately small. Every project is led by a Principal and supported by a focused technical team. This structure lets us respond quickly, control quality at every stage, and build long-term working relationships with our clients.",
          "GTek serves clients across Canada from our Winnipeg office, with active projects in Manitoba and surrounding provinces. We undertake assignments at any stage—from desktop study through construction monitoring and long-term performance review.",
        ];

  const team =
    about?.teamMembers?.length
      ? about.teamMembers
      : [
          {
            name: "Wayne Wong, P.Eng.",
            title: "Principal Engineer",
            credentials: "P.Eng.",
            bio: "25+ years of geotechnical experience across dam safety, mining, and foundation engineering. Wayne leads GTek’s technical delivery and serves as Engineer of Record on major projects.",
          },
          {
            name: "Gamini MediWake",
            title: "Senior Engineer",
            credentials: "Credentials TBD",
            bio: "Senior engineer supporting geotechnical design and construction-phase delivery across multiple sectors. (Bio to be refined with Gamini’s input.)",
          },
          {
            name: "Dr. Marolo Alfaro",
            title: "Senior Technical Advisor",
            credentials: "Ph.D.",
            bio: "Provides academic and research depth for technical reviews, analysis, and independent verification. (Bio to be refined with Dr. Alfaro’s input.)",
          },
          {
            name: "Kevin Nguyen, EIT",
            title: "Geotechnical Engineer-in-Training",
            credentials: "EIT",
            bio: "Supports field programs, data interpretation, and reporting with a focus on practical site outcomes. (Bio to be refined with Kevin’s input.)",
          },
        ];

  const affiliations =
    about?.affiliations?.length
      ? about.affiliations
      : ["Engineers Geoscientists Manitoba", "Canadian Dam Association", "Canadian Geotechnical Society"];

  return (
    <main>
      <Section className="bg-gradient-to-b from-slate-50 to-white py-16 dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-gtek-navy dark:text-slate-200 md:text-5xl">About GTek</h1>
          <div className="mt-6 space-y-4 text-slate-700 leading-relaxed dark:text-slate-400">
            {narrative.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-white py-14 dark:bg-slate-950">
        <div className="max-w-5xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-gtek-navy dark:text-slate-200">Team</h2>
          <p className="mt-3 text-slate-600 leading-relaxed dark:text-slate-400">
            Clients hire people, not logos. Meet the team leading GTek’s technical delivery.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((p) => (
            <Card key={p.name} className="overflow-hidden hover:-translate-y-1 hover:shadow-md">
              <div className="aspect-square w-full bg-gradient-to-br from-slate-100 to-slate-200">
                {p.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="text-center px-6">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Headshot</p>
                      <p className="mt-1 text-xs text-slate-500">300×300 square crop</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-base font-extrabold text-slate-900 leading-snug dark:text-slate-200">{p.name}</p>
                <p className="mt-1 text-sm font-semibold text-gtek-navy dark:text-slate-300">{p.title}</p>
                {p.credentials ? (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{p.credentials}</p>
                ) : null}
                <p className="mt-3 text-sm text-slate-700 leading-relaxed dark:text-slate-400">{p.bio}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card className="bg-slate-50 p-6 dark:bg-slate-900">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-200">Credentials & affiliations</h3>
            <p className="mt-3 text-sm text-slate-700 leading-relaxed dark:text-slate-400">
              {affiliations.join(" • ")}
            </p>
          </Card>
        </div>
      </Section>
    </main>
  );
}
