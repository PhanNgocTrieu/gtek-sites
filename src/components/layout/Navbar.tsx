"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { siteConfig } from "@/content/siteConfig";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const companyName = siteConfig.settings.companyName;
  const navItems = siteConfig.settings.nav.filter((item) => item.href !== "/contact");
  const contactItem = siteConfig.settings.nav.find((item) => item.href === "/contact") ?? {
    href: "/contact",
    label: "Contact",
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-[200] isolate w-full border-b border-slate-200/30 bg-white/90 text-slate-900 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85 dark:text-slate-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gtek-navy"
        >
          <Image
            src="/images/gtek-logo.png"
            alt={companyName}
            width={238}
            height={120}
            className="h-9 w-auto md:h-10"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-2 text-sm font-semibold md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 transition-colors ${
                isActive(item.href)
                  ? "bg-gtek-navy text-slate-100"
                  : "text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100 dark:active:bg-slate-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={contactItem.href}
            className="ml-2 inline-flex items-center justify-center rounded-full bg-gtek-amber px-5 py-2 text-sm font-bold text-gtek-navy transition-colors hover:bg-yellow-400 active:bg-yellow-500 dark:hover:bg-yellow-300 dark:active:bg-yellow-200"
          >
            {contactItem.label}
          </Link>
          <ThemeToggle />
        </nav>
        <div className="md:hidden">
          <button
            type="button"
            className="rounded-md p-1 text-slate-700 hover:bg-slate-100 hover:text-gtek-navy active:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-slate-100 dark:active:bg-slate-600"
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
        <div className="border-t border-slate-200 bg-white/95 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-950/95">
          <nav id="mobile-nav" className="container mx-auto flex flex-col gap-2 px-4 py-4 text-sm font-semibold">
            {[...navItems, contactItem].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 ${
                  isActive(item.href)
                    ? "bg-gtek-navy text-slate-100"
                    : "text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100 dark:active:bg-slate-600"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-2 pt-1">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
