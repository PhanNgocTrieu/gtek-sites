import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import SiteFrame from "@/components/layout/SiteFrame";
import Footer from "@/components/layout/Footer";
import ThemeScript from "@/components/theme/ThemeScript";
import { siteConfig } from "@/content/siteConfig";
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
  metadataBase: new URL(siteConfig.settings.seo.canonical),
  title: {
    default: siteConfig.settings.seo.defaultTitle,
    template: siteConfig.settings.seo.titleTemplate,
  },
  description: siteConfig.settings.seo.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.settings.seo.siteName,
    title: siteConfig.settings.seo.defaultTitle,
    description: siteConfig.settings.seo.description,
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
        <SiteFrame footer={<Footer />}>{children}</SiteFrame>
      </body>
    </html>
  );
}
