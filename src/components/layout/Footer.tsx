import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-4">GTek Engineering Inc.</h3>
          <p className="text-sm">
            Your Partner in Ground Truth and Solutions. Providing expert geotechnical consulting and material testing.
          </p>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Contact Info</h3>
          <address className="not-italic text-sm space-y-2">
            <p>Winnipeg, MB</p>
            <p>Canada</p>
            <p className="pt-2">Email: <a href="mailto:contact@gtekengineering.ca" className="hover:text-gtek-amber transition-colors">contact@gtekengineering.ca</a></p>
          </address>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg mb-4">Licenses & Affiliations</h3>
          <ul className="text-sm space-y-2">
            <li>M.Eng., P.Eng.</li>
            <li>Licensed in MB, SK, BC</li>
            <li>Canadian Geotechnical Society</li>
            <li>Canadian Dam Association</li>
          </ul>
          <div className="mt-6">
            <h4 className="text-white font-bold text-sm mb-2">Content Editing</h4>
            <ul className="text-sm space-y-2">
              <li>
                <Link className="hover:text-gtek-amber transition-colors" href="/editing">
                  Editing guide (non-tech)
                </Link>
              </li>
              <li>
                <Link className="hover:text-gtek-amber transition-colors" href="/studio">
                  Open content editor
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} GTek Engineering Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
