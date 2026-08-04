"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function SiteFrame({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudioRoute = pathname.startsWith("/studio");

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      {!isStudioRoute ? footer : null}
    </>
  );
}
