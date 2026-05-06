import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import SiteFrame from "@/components/layout/SiteFrame";
import ThemeScript from "@/components/theme/ThemeScript";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gtekengineering.ca"),
  title: {
    default: "GTek Engineering Inc.",
    template: "%s | GTek Engineering",
  },
  description:
    "GTek Engineering Inc. provides geotechnical consulting, dam safety support, and materials testing services in Winnipeg, Manitoba.",
  openGraph: {
    type: "website",
    siteName: "GTek Engineering Inc.",
    title: "GTek Engineering Inc.",
    description:
      "Geotechnical consulting, dam safety support, and materials testing services in Winnipeg, Manitoba.",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 flex flex-col min-h-screen`}
      >
        <ThemeScript />
        <GoogleAnalytics />
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
