"use client";

import { DesktopComingSoon } from "@/components/DesktopComingSoon";
import { usePathname } from "next/navigation";

export function RootChrome({
  children,
  loraClassName,
  interClassName,
}: {
  children: React.ReactNode;
  loraClassName: string;
  interClassName: string;
}) {
  const pathname = usePathname();
  const hideDesktopComingSoon = pathname === "/design";

  return (
    <>
      {!hideDesktopComingSoon && (
        <DesktopComingSoon loraClassName={loraClassName} interClassName={interClassName} />
      )}
      {children}
    </>
  );
}
