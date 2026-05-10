"use client";

import Link from "next/link";

/** Floating entry to `/studio` for editors — kept discreet on public pages. */
export default function SanityStudioFab() {
  return (
    <Link
      href="/studio"
      className="fixed bottom-5 right-5 z-[160] inline-flex items-center gap-2 rounded-full border border-slate-200 bg-gtek-navy px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-gtek-navy/95 active:bg-gtek-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gtek-navy dark:border-slate-600 dark:shadow-slate-950/40 sm:bottom-6 sm:right-6"
      aria-label="Open Sanity content editor"
      title="Content editor"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
      <span>Editor</span>
    </Link>
  );
}
