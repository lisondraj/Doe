"use client";

import { DesktopHome } from "@/components/home/DesktopHome";
import { useDesignersStaticNav } from "@/lib/designers/use-designers-static-nav";

export function DoePhoneDesktopView() {
  const staticNav = useDesignersStaticNav();
  return (
    <DesktopHome logoLink={!staticNav} navActionLinksEnabled={!staticNav} />
  );
}
