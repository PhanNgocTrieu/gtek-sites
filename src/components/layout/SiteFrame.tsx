"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudioRoute = pathname.startsWith("/studio");

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      {!isStudioRoute ? <Footer /> : null}
    </>
  );
}
