import Link from "next/link";
import { type ReactNode } from "react";

const variants = {
  primary:
    "bg-gtek-amber text-gtek-navy hover:bg-yellow-400 active:bg-yellow-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gtek-amber",
  secondary:
    "bg-transparent border-2 border-slate-300 text-slate-900 hover:border-slate-400 hover:bg-slate-50 active:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400",
  darkSecondary:
    "bg-transparent border-2 border-slate-400 text-white hover:border-slate-100 hover:bg-slate-800 active:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
} as const;

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-center text-base font-bold transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

