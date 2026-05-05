import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 py-14 text-slate-400">
      <div className="container mx-auto grid grid-cols-1 gap-10 px-4 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-lg font-bold text-slate-200">GTek Engineering Inc.</h3>
          <p className="text-sm leading-relaxed text-slate-400">
            Senior-led geotechnical consulting for dam safety, mining, foundations, and slope stability projects across
            Canada.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-bold text-slate-200">Contact Info</h3>
          <address className="not-italic space-y-2 text-sm">
            <p>Winnipeg, MB</p>
            <p>Canada</p>
            <p className="pt-2">
              Email:{" "}
              <a href="mailto:contact@gtekengineering.ca" className="transition-colors hover:text-gtek-amber">
                contact@gtekengineering.ca
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
          <div className="mt-6">
            <h4 className="mb-2 text-sm font-bold text-slate-200">Content Editing</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="transition-colors hover:text-gtek-amber" href="/editing">
                  Editing guide (non-tech)
                </Link>
              </li>
              <li>
                <Link className="transition-colors hover:text-gtek-amber" href="/studio">
                  Open content editor
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-10 border-t border-slate-800 px-4 pt-8 text-center text-sm text-slate-400">
        <p>&copy; {new Date().getFullYear()} GTek Engineering Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
