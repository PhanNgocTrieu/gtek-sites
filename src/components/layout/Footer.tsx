import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 py-14 text-slate-400">
      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 md:grid-cols-3">
        <div>
          <Image
            src="/images/gtek-logo.png"
            alt="GTek Engineering Inc."
            width={238}
            height={120}
            className="mb-5 h-11 w-auto max-w-[min(100%,260px)]"
          />
          <p className="text-sm leading-relaxed text-slate-400">
            Senior-led geotechnical consulting for dam safety, mining, foundations, and slope stability projects across
            Canada.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-bold text-slate-200">Contact Info</h3>
          <address className="not-italic space-y-2 text-sm">
            <p>Phone +1 204 792 8829</p>
            <p className="pt-2">
              Email:{" "}
              <a
                href="mailto:wayne.wong@gtekeng.com"
                className="transition-colors hover:text-gtek-amber active:text-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gtek-amber"
              >
                wayne.wong@gtekeng.com
              </a>
            </p>
          </address>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-bold text-slate-200">Licenses & Affiliations</h3>
          <ul className="space-y-2 text-sm">
            <li>M.Eng., P.Eng.</li>
            <li>Licensed in MB, SK, BC</li>
            <li>Canadian Geotechnical Society</li>
            <li>Canadian Dam Association</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-10 border-t border-slate-800 px-4 pt-8 text-center text-sm text-slate-400">
        <p>&copy; {new Date().getFullYear()} GTek Engineering Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
