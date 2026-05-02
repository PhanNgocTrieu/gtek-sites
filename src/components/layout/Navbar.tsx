"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gtek-navy text-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-xl tracking-tight">
          <Link href="/" className="flex items-center gap-2 hover:text-gtek-amber transition-colors">
            <span className="text-gtek-amber">GTek</span> Engineering
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-gtek-amber transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-gtek-amber transition-colors">
            About
          </Link>
          <Link href="/services" className="hover:text-gtek-amber transition-colors">
            Services
          </Link>
          <Link href="/projects" className="hover:text-gtek-amber transition-colors">
            Projects
          </Link>
          <Link href="/contact" className="hover:text-gtek-amber transition-colors">
            Contact
          </Link>
        </nav>
        <div className="md:hidden">
          <button
            type="button"
            className="text-white hover:text-gtek-amber"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen((v) => !v)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="md:hidden border-t border-white/10 bg-gtek-navy/95 backdrop-blur">
          <nav id="mobile-nav" className="container mx-auto px-4 py-4 flex flex-col gap-2 text-sm font-medium">
            <Link href="/" className="rounded px-3 py-2 hover:bg-white/10" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link href="/about" className="rounded px-3 py-2 hover:bg-white/10" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <Link href="/services" className="rounded px-3 py-2 hover:bg-white/10" onClick={() => setIsOpen(false)}>
              Services
            </Link>
            <Link href="/projects" className="rounded px-3 py-2 hover:bg-white/10" onClick={() => setIsOpen(false)}>
              Projects
            </Link>
            <Link href="/contact" className="rounded px-3 py-2 hover:bg-white/10" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
